"""
================================================================================
RECEIPT EXTRACTOR - AI-Powered Structured Data Extraction
================================================================================
This module uses OpenAI's GPT models to convert raw OCR text into structured
receipt data with validation.

ARCHITECTURE:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Raw OCR Text  │ --> │  OpenAI GPT-4   │ --> │  Pydantic Model │
│   (unstructured)│     │  (extraction)   │     │  (validated)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘

WHY USE AI FOR EXTRACTION?
Raw OCR text is messy and unstructured. It might look like:

    GROCERY STORE
    123 Main St
    ------------------
    Milk 2.50
    Bread 3.00
    TAX 0.44
    TOTAL 5.94

An AI model can understand this context and extract:
- Merchant name: "GROCERY STORE"
- Items: [{"name": "Milk", "total_price": 2.50}, ...]
- Total: 5.94

WHAT IS PYDANTIC?
Pydantic is a data validation library that:
1. Defines the expected data structure (schema)
2. Validates that data matches the schema
3. Provides clear error messages when validation fails
4. Converts types automatically (e.g., "2.50" -> 2.50)

================================================================================
"""

# ==============================================================================
# IMPORTS
# ==============================================================================

import json                                   # JSON parsing for API responses
import re                                     # Regular expressions
from typing import List, Optional             # Type hints for clearer code

from dotenv import load_dotenv                # Load environment variables from .env file
load_dotenv()                                  # This loads OPENAI_API_KEY from .env

from openai import OpenAI                     # OpenAI Python SDK
from pydantic import BaseModel, Field, ValidationError  # Data validation

# Initialize OpenAI client (automatically uses OPENAI_API_KEY from environment)
client = OpenAI()


# ==============================================================================
# PYDANTIC DATA MODELS
# ==============================================================================
# These classes define the expected structure of extracted receipt data.
# Pydantic will validate that the AI's response matches this structure.

class ReceiptItem(BaseModel):
    """
    Represents a single line item on a receipt.
    
    Attributes:
        name: Item description (e.g., "Milk", "Coffee")
        quantity: Number of items (e.g., 2). Optional.
        unit_price: Price per unit (e.g., 2.50). Optional.
        total_price: Total for this line (quantity * unit_price). Optional.
    
    Example:
        {"name": "Milk", "quantity": 2, "unit_price": 2.50, "total_price": 5.00}
    """
    name: str
    quantity: Optional[float] = None        # Optional = can be None/null
    unit_price: Optional[float] = None
    total_price: Optional[float] = None


class ReceiptOutput(BaseModel):
    """
    Complete structured representation of a receipt.
    
    This is the main output model that contains all extracted receipt data.
    All fields except doc_type and items are optional since not all receipts
    have all information.
    
    Attributes:
        doc_type: Always "receipt" (identifies document type)
        merchant: Store/restaurant name
        address: Business address
        phone: Contact phone number
        date: Transaction date (as string, various formats)
        time: Transaction time
        currency: Currency code (USD, EUR, etc.)
        items: List of line items
        subtotal: Sum before tax
        tax: Tax amount
        total: Final total
    """
    doc_type: str = "receipt"                      # Default value
    merchant: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    currency: Optional[str] = None
    items: List[ReceiptItem] = Field(default_factory=list)  # Empty list by default
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None


# ==============================================================================
# PROMPT ENGINEERING
# ==============================================================================
# The prompt tells the AI exactly what we want and how to format the output.
# Good prompts are specific and include examples of edge cases.

RECEIPT_SCHEMA_DESC = """
Return ONLY valid JSON with this schema:
{
  "doc_type": "receipt",
  "merchant": string|null,
  "address": string|null,
  "phone": string|null,
  "date": string|null,
  "time": string|null,
  "currency": string|null,
  "items": [
    {"name": string, "quantity": number|null, "unit_price": number|null, "total_price": number|null}
  ],
  "subtotal": number|null,
  "tax": number|null,
  "total": number|null
}

Rules:
- If missing, use null.
- Parse prices like "1,20" as 1.20 (comma decimal).
- Lines like "ItemName 6.50" => treat as total_price unless quantity/unit_price is clear.
- Extract any fields you can from the OCR text. Do not return all nulls if values are present.
- IMPORTANT: If you see standalone money amounts with no item label (e.g., "$3.50" on its own line),
  still include them as items like:
  {"name":"Unlabeled","quantity":null,"unit_price":null,"total_price":3.50}
- Do not add extra keys.
- Output JSON only (no backticks, no commentary).
"""


# ==============================================================================
# OPENAI API FUNCTIONS
# ==============================================================================

def _extract_receipt_json_raw(ocr_text: str, model: str = "gpt-4.1-mini") -> dict:
    """
    Send OCR text to OpenAI and get structured JSON response.
    
    This function:
    1. Constructs a prompt with the OCR text and extraction rules
    2. Sends it to the OpenAI Chat Completions API
    3. Parses the JSON response
    
    Args:
        ocr_text: Raw text from OCR
        model: OpenAI model to use (default: gpt-4.1-mini for cost efficiency)
    
    Returns:
        Dictionary containing extracted receipt data
    
    Note:
        The underscore prefix (_) indicates this is a private/internal function.
        Use extract_and_validate_receipt() for the public API.
    """
    # Make API call to OpenAI
    resp = client.chat.completions.create(
        model=model,
        messages=[
            # System message sets the AI's role/behavior
            {"role": "system", "content": "You extract structured data from OCR text."},
            # User message contains the actual request
            {"role": "user", "content": f"{RECEIPT_SCHEMA_DESC}\n\nOCR TEXT:\n{ocr_text}"},
        ],
        temperature=0,  # 0 = deterministic output (same input = same output)
    )
    
    # Extract the text content from the response
    # Response structure: resp.choices[0].message.content
    return json.loads(resp.choices[0].message.content)


# ==============================================================================
# FALLBACK LOGIC
# ==============================================================================
# Sometimes the AI misses obvious data. These functions provide fallbacks.

def _find_orphan_amounts(ocr_text: str) -> list[float]:
    """
    Find standalone price amounts that might have been missed.
    
    Sometimes receipts have prices on their own lines without item names:
        $3.50
        6.25
    
    This function finds these "orphan" amounts so we can add them as items.
    
    Args:
        ocr_text: Raw OCR text
    
    Returns:
        List of float amounts found
    
    Example:
        >>> _find_orphan_amounts("Something\\n$3.50\\n6.25\\nTotal")
        [3.50, 6.25]
    """
    amounts: list[float] = []
    
    for ln in ocr_text.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        
        # Match lines that are ONLY a price (nothing else)
        # Pattern: optional $, optional spaces, digits, optional .XX
        # \$? means optional dollar sign
        # \s* means zero or more spaces
        # \d+ means one or more digits
        # (?:\.\d{2})? means optional .XX (non-capturing group)
        m = re.fullmatch(r"\$?\s*(\d+(?:\.\d{2})?)", ln)
        if m:
            amounts.append(float(m.group(1)))
    
    return amounts


def _apply_orphan_amount_fallback(data: dict, ocr_text: str) -> dict:
    """
    Add orphan amounts as items if the AI returned empty items list.
    
    This is a deterministic fallback for cases where the AI fails to extract
    items but the OCR text clearly contains prices.
    
    Args:
        data: Extracted data dictionary from AI
        ocr_text: Original OCR text
    
    Returns:
        Updated data dictionary with orphan items added if applicable
    """
    items = data.get("items") or []
    
    # Only apply fallback if no items were extracted
    if items:
        return data

    # Find orphan amounts in OCR text
    amounts = _find_orphan_amounts(ocr_text)
    if not amounts:
        return data

    # Create placeholder items for each orphan amount
    data["items"] = [
        {"name": "Unlabeled", "quantity": None, "unit_price": None, "total_price": amt}
        for amt in amounts
    ]
    return data


# ==============================================================================
# MAIN EXTRACTION FUNCTION
# ==============================================================================

def extract_and_validate_receipt(ocr_text: str, model: str = "gpt-4.1-mini") -> ReceiptOutput:
    """
    Extract structured receipt data from OCR text and validate it.
    
    This is the main public function of the receipt extractor. It:
    1. Sends OCR text to OpenAI for extraction
    2. Applies fallback logic for edge cases
    3. Validates the response against the Pydantic schema
    4. If validation fails, asks AI to fix the JSON
    
    Args:
        ocr_text: Raw text from OCR (output of extract_text_from_image_bytes)
        model: OpenAI model to use
    
    Returns:
        ReceiptOutput Pydantic model with validated receipt data
    
    Raises:
        ValidationError: If the AI response cannot be validated after repair
    
    Example:
        >>> text = "GROCERY STORE\\nMilk $3.50\\nTotal $3.50"
        >>> receipt = extract_and_validate_receipt(text)
        >>> print(receipt.merchant)
        'GROCERY STORE'
        >>> print(receipt.total)
        3.50
    """
    # Step 1: Extract data using AI
    data = _extract_receipt_json_raw(ocr_text, model=model)

    # Step 2: Apply deterministic fallback for sparse receipts
    data = _apply_orphan_amount_fallback(data, ocr_text)

    # Step 3: Validate against Pydantic schema
    try:
        return ReceiptOutput.model_validate(data)
    except ValidationError as e:
        # -----------------------------------------
        # SELF-HEALING: Ask AI to fix invalid JSON
        # -----------------------------------------
        # If the initial response doesn't match our schema,
        # we send it back to the AI with the validation errors
        # and ask it to fix the issues.
        
        repair_prompt = f"""
Fix the JSON to match the schema exactly and return JSON only.

Validation errors:
{e}

OCR TEXT:
{ocr_text}

Bad JSON:
{json.dumps(data, indent=2)}
"""
        # Ask AI to repair the JSON
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You fix JSON to match the required schema exactly."},
                {"role": "user", "content": repair_prompt},
            ],
            temperature=0,
        )
        fixed = json.loads(resp.choices[0].message.content)

        # Apply fallback again after repair, just in case
        fixed = _apply_orphan_amount_fallback(fixed, ocr_text)

        # Validate the repaired JSON (will raise if still invalid)
        return ReceiptOutput.model_validate(fixed)

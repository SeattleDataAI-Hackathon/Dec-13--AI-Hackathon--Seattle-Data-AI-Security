"""
================================================================================
RECEIPT SCANNER - STREAMLIT FRONTEND
================================================================================
This is the main web application that provides a user interface for scanning
receipts. It combines OCR (Optical Character Recognition) with AI to extract
structured data from receipt images.

ARCHITECTURE OVERVIEW:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User uploads   │ --> │  OCR extracts   │ --> │  AI parses to   │
│  receipt image  │     │  raw text       │     │  structured JSON│
└─────────────────┘     └─────────────────┘     └─────────────────┘
      (app.py)              (ocr.py)         (receipt_extractor.py)

TECHNOLOGIES USED:
- Streamlit: Python web framework for creating interactive web apps
- Tesseract OCR: Open-source text recognition engine
- OpenAI GPT: Large language model for understanding and structuring text
- Pydantic: Data validation library for ensuring correct output format
================================================================================
"""

# ==============================================================================
# IMPORTS
# ==============================================================================

from __future__ import annotations  # Enables modern type hints (e.g., list[str] instead of List[str])

import streamlit as st      # Web framework - creates the UI components
from PIL import Image       # Python Imaging Library - handles image files
import json                 # For JSON serialization (not directly used but available)

# Import our custom modules:
# - ocr.py: Contains the Tesseract OCR logic and image preprocessing
# - receipt_extractor.py: Contains the OpenAI integration and Pydantic models
from ocr import extract_text_from_image_bytes
from extractors.receipt_extractor import extract_and_validate_receipt, ReceiptOutput


# ==============================================================================
# PAGE CONFIGURATION
# ==============================================================================
# This must be the first Streamlit command in the script.
# It sets up the browser tab title, icon, and layout preferences.

st.set_page_config(
    page_title="Receipt Scanner",     # Shows in browser tab
    page_icon="🧾",                    # Favicon in browser tab
    layout="wide",                     # Use full width of browser
    initial_sidebar_state="expanded",  # Sidebar starts open
)


# ==============================================================================
# CUSTOM CSS STYLING
# ==============================================================================
# Streamlit allows injecting custom CSS to override default styles.
# We use this to create a modern, dark-themed UI.
#
# Key CSS concepts used:
# - CSS Variables (--var-name): Define reusable colors/values
# - Flexbox: For layout alignment
# - Gradients: For modern background effects
# - Transitions: For smooth hover animations

st.markdown("""
<style>
    /* =========================================
       GOOGLE FONTS IMPORT
       =========================================
       We import two fonts:
       - JetBrains Mono: Monospace font for code/technical text
       - Outfit: Modern sans-serif for headings and UI
    */
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
    
    /* =========================================
       CSS VARIABLES (Custom Properties)
       =========================================
       Define a color palette that can be reused throughout.
       Using variables makes it easy to maintain consistent colors.
    */
    :root {
        --bg-primary: #0a0a0f;       /* Darkest background */
        --bg-secondary: #12121a;      /* Slightly lighter background */
        --bg-card: #1a1a24;           /* Card/container background */
        --accent: #00d4aa;            /* Teal accent color - main brand color */
        --accent-dim: #00d4aa33;      /* Transparent version of accent (33 = 20% opacity) */
        --text-primary: #f0f0f5;      /* Main text color (off-white) */
        --text-secondary: #8888aa;    /* Muted text for labels */
        --border: #2a2a3a;            /* Border color for cards */
    }
    
    /* =========================================
       MAIN APP BACKGROUND
       =========================================
       Apply a diagonal gradient to the entire app background.
       This creates visual depth compared to a flat color.
    */
    .stApp {
        background: linear-gradient(135deg, var(--bg-primary) 0%, #0d0d14 50%, #101018 100%);
    }
    
    /* =========================================
       HEADER STYLES
       =========================================
       The main title uses a gradient text effect.
       This is achieved by:
       1. Setting a gradient as background
       2. Clipping background to text shape
       3. Making text transparent so gradient shows through
    */
    .main-header {
        font-family: 'Outfit', sans-serif;
        font-size: 2.8rem;
        font-weight: 700;
        /* Gradient goes from teal -> cyan -> purple */
        background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 50%, #7c3aed 100%);
        -webkit-background-clip: text;           /* Clip gradient to text (Safari/Chrome) */
        -webkit-text-fill-color: transparent;    /* Make text transparent */
        background-clip: text;                   /* Standard property */
        margin-bottom: 0.5rem;
        letter-spacing: -0.02em;                 /* Slightly tighter letter spacing */
    }
    
    .sub-header {
        font-family: 'Outfit', sans-serif;
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-bottom: 2rem;
        font-weight: 300;  /* Light weight for subtitle */
    }
    
    /* =========================================
       METRIC CARDS
       =========================================
       Cards display individual data points (merchant, date, totals).
       Features:
       - Gradient background for depth
       - Border and shadow for definition
       - Hover animation for interactivity
    */
    .metric-card {
        background: linear-gradient(145deg, var(--bg-card) 0%, #1f1f2a 100%);
        border: 1px solid var(--border);
        border-radius: 16px;               /* Rounded corners */
        padding: 1.5rem;
        margin: 0.5rem 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);  /* Soft shadow */
        transition: transform 0.2s ease, box-shadow 0.2s ease;  /* Smooth animation */
    }
    
    /* Hover effect - card lifts up slightly */
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 212, 170, 0.1);  /* Teal-tinted glow */
    }
    
    .metric-label {
        font-family: 'JetBrains Mono', monospace;
        color: var(--text-secondary);
        font-size: 0.75rem;
        text-transform: uppercase;         /* ALL CAPS for labels */
        letter-spacing: 0.1em;             /* Spread letters out */
        margin-bottom: 0.5rem;
    }
    
    .metric-value {
        font-family: 'Outfit', sans-serif;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
    }
    
    /* Special accent color for important values (like total) */
    .metric-value-accent {
        color: var(--accent);
    }
    
    /* =========================================
       ITEMS TABLE
       =========================================
       Displays line items from the receipt.
       Uses a clean, minimal table design.
    */
    .items-table {
        width: 100%;
        border-collapse: separate;  /* Allows border-spacing */
        border-spacing: 0;
        margin: 1rem 0;
    }
    
    .items-table th {
        font-family: 'JetBrains Mono', monospace;
        background: var(--bg-secondary);
        color: var(--accent);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 1rem;
        text-align: left;
        border-bottom: 2px solid var(--accent-dim);
    }
    
    .items-table td {
        font-family: 'Outfit', sans-serif;
        padding: 1rem;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border);
        font-size: 0.95rem;
    }
    
    /* Row highlight on hover */
    .items-table tr:hover td {
        background: var(--accent-dim);
    }
    
    /* =========================================
       OCR OUTPUT BOX
       =========================================
       Displays raw text extracted by Tesseract.
       Uses monospace font since it's raw output.
    */
    .ocr-output {
        font-family: 'JetBrains Mono', monospace;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 1.5rem;
        font-size: 0.85rem;
        line-height: 1.6;
        color: var(--text-secondary);
        white-space: pre-wrap;     /* Preserve whitespace and line breaks */
        max-height: 400px;
        overflow-y: auto;          /* Scroll if content is too long */
    }
    
    /* =========================================
       SECTION TITLES
       =========================================
    */
    .section-title {
        font-family: 'Outfit', sans-serif;
        color: var(--text-primary);
        font-size: 1.3rem;
        font-weight: 600;
        margin: 1.5rem 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* =========================================
       STATUS BADGES
       =========================================
       Small pill-shaped indicators (e.g., "OCR Complete")
    */
    .status-badge {
        font-family: 'JetBrains Mono', monospace;
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;           /* Pill shape */
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .status-success {
        background: rgba(0, 212, 170, 0.15);
        color: #00d4aa;
        border: 1px solid rgba(0, 212, 170, 0.3);
    }
    
    /* =========================================
       FILE UPLOAD ZONE
       =========================================
    */
    .upload-zone {
        border: 2px dashed var(--border);
        border-radius: 16px;
        padding: 3rem;
        text-align: center;
        background: var(--bg-card);
        transition: border-color 0.2s ease;
    }
    
    .upload-zone:hover {
        border-color: var(--accent);
    }
    
    /* =========================================
       HIDE STREAMLIT BRANDING
       =========================================
       Removes the hamburger menu and "Made with Streamlit" footer
    */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Sidebar styling */
    .css-1d391kg {
        background: var(--bg-secondary);
    }
    
    /* =========================================
       BUTTON STYLING
       =========================================
       Override Streamlit's default button with our design
    */
    .stButton > button {
        font-family: 'Outfit', sans-serif;
        background: linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%);
        color: #0a0a0f;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.2s ease;
        width: 100%;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 212, 170, 0.3);
    }
    
    /* Style the file uploader component */
    div[data-testid="stFileUploader"] {
        background: var(--bg-card);
        border: 2px dashed var(--border);
        border-radius: 16px;
        padding: 1rem;
    }
    
    div[data-testid="stFileUploader"]:hover {
        border-color: var(--accent);
    }
</style>
""", unsafe_allow_html=True)


# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def format_currency(value: float | None, currency: str | None = None) -> str:
    """
    Format a numeric value as currency.
    
    Args:
        value: The numeric amount (e.g., 12.50). Can be None if not available.
        currency: Currency code like "USD", "EUR", "GBP". Defaults to "$".
    
    Returns:
        Formatted string like "$12.50" or "—" if value is None.
    
    Example:
        >>> format_currency(12.5, "EUR")
        '€12.50'
        >>> format_currency(None)
        '—'
    """
    if value is None:
        return "—"  # Em dash indicates missing data
    
    # Map currency codes to symbols
    symbol = "$" if currency is None else {"USD": "$", "EUR": "€", "GBP": "£"}.get(currency, "$")
    return f"{symbol}{value:.2f}"  # .2f formats to 2 decimal places


def render_receipt_data(receipt: ReceiptOutput):
    """
    Render the structured receipt data as styled HTML cards.
    
    This function takes the validated Pydantic model (ReceiptOutput) and
    displays it in a user-friendly format with:
    - Merchant info cards (name, date, time)
    - Items table with quantities and prices
    - Totals section (subtotal, tax, total)
    
    Args:
        receipt: A ReceiptOutput Pydantic model containing parsed receipt data.
    """
    
    # -----------------------------------------
    # MERCHANT INFO ROW
    # -----------------------------------------
    # Create 3 columns of equal width for merchant, date, and time
    # Using Streamlit's native metric component for reliable rendering
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(label="Merchant", value=receipt.merchant or "—")
    
    with col2:
        st.metric(label="Date", value=receipt.date or "—")
    
    with col3:
        st.metric(label="Time", value=receipt.time or "—")
    
    # -----------------------------------------
    # CONTACT INFO (Optional)
    # -----------------------------------------
    # Only show address/phone if they exist
    if receipt.address or receipt.phone:
        col1, col2 = st.columns(2)
        with col1:
            if receipt.address:
                st.metric(label="Address", value=receipt.address)
        with col2:
            if receipt.phone:
                st.metric(label="Phone", value=receipt.phone)
    
    # -----------------------------------------
    # ITEMS TABLE
    # -----------------------------------------
    st.subheader("📦 Items")
    
    if receipt.items:
        # Build a list of dictionaries for the dataframe
        # Using Streamlit's native dataframe for reliable rendering
        items_data = []
        for item in receipt.items:
            items_data.append({
                "Item": item.name,
                "Qty": f"{item.quantity:.0f}" if item.quantity else "—",
                "Unit Price": format_currency(item.unit_price, receipt.currency),
                "Total": format_currency(item.total_price, receipt.currency),
            })
        
        # Display as a native Streamlit dataframe
        # This renders reliably without HTML issues
        st.dataframe(
            items_data,
            use_container_width=True,
            hide_index=True,
        )
    else:
        # Show message if no items were detected
        st.info("No line items detected in this receipt")
    
    # -----------------------------------------
    # TOTALS SECTION
    # -----------------------------------------
    st.subheader("💰 Totals")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        # Streamlit's native metric component
        st.metric(label="Subtotal", value=format_currency(receipt.subtotal, receipt.currency))
    
    with col2:
        st.metric(label="Tax", value=format_currency(receipt.tax, receipt.currency))
    
    with col3:
        st.metric(label="Total", value=format_currency(receipt.total, receipt.currency))


# ==============================================================================
# MAIN APPLICATION
# ==============================================================================

def main():
    """
    Main entry point for the Streamlit application.
    
    This function:
    1. Initializes session state for persisting data across reruns
    2. Renders the header and sidebar
    3. Handles file upload
    4. Triggers OCR and AI processing
    5. Displays results
    """
    
    # -----------------------------------------
    # SESSION STATE INITIALIZATION
    # -----------------------------------------
    # Streamlit reruns the entire script on every user interaction.
    # Session state persists data between these reruns.
    # Without this, results would disappear when the user clicks a checkbox.
    
    if "ocr_result" not in st.session_state:
        st.session_state.ocr_result = None      # Stores OCR output
    if "receipt" not in st.session_state:
        st.session_state.receipt = None          # Stores parsed receipt data
    if "last_file_name" not in st.session_state:
        st.session_state.last_file_name = None   # Tracks which file was processed
    
    # -----------------------------------------
    # HEADER
    # -----------------------------------------
    st.markdown('<h1 class="main-header">🧾 Receipt Scanner</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Upload a receipt image to extract structured data using OCR + AI</p>', unsafe_allow_html=True)
    
    # -----------------------------------------
    # SIDEBAR
    # -----------------------------------------
    # The sidebar contains settings and help text
    with st.sidebar:
        st.markdown("### ⚙️ Settings")
        
        # Checkbox to enable/disable image preprocessing
        enable_preprocessing = st.checkbox(
            "Enable image preprocessing", 
            value=True,  # Default: enabled
            help="Applies grayscale, upscaling, denoising, and contrast enhancement"
        )
        
        # Toggle to show raw OCR text
        show_raw_ocr = st.checkbox(
            "Show raw OCR text", 
            value=True,
            help="Display the raw text extracted by Tesseract"
        )
        
        # Toggle to show JSON output
        show_json = st.checkbox(
            "Show JSON output", 
            value=True,
            help="Display the structured data as JSON"
        )
        
        st.markdown("---")  # Horizontal divider
        
        # Help section explaining the process
        st.markdown("### 📖 How it works")
        st.markdown("""
        1. **Upload** a receipt image
        2. **OCR** extracts text using Tesseract
        3. **AI** parses the text into structured data
        4. **View** merchant, items, and totals
        """)
        
        st.markdown("---")
        
        # Footer with tech stack info
        st.markdown("""
        <div style="font-size: 0.8rem; color: #666;">
        Built with Tesseract OCR + OpenAI<br>
        Supports JPG, PNG, WEBP
        </div>
        """, unsafe_allow_html=True)
    
    # -----------------------------------------
    # FILE UPLOADER
    # -----------------------------------------
    # Streamlit's file_uploader widget returns a file-like object when a file is uploaded
    uploaded_file = st.file_uploader(
        "Drop a receipt image here",
        type=["png", "jpg", "jpeg", "webp"],  # Allowed file types
        help="Upload a clear image of your receipt"
    )
    
    # -----------------------------------------
    # MAIN PROCESSING LOGIC
    # -----------------------------------------
    if uploaded_file is not None:
        # Check if this is a new file (different from last processed)
        # If so, reset the stored results
        if st.session_state.last_file_name != uploaded_file.name:
            st.session_state.ocr_result = None
            st.session_state.receipt = None
            st.session_state.last_file_name = uploaded_file.name
        
        # Read the image as raw bytes (needed for OCR)
        image_bytes = uploaded_file.read()
        
        # Reset file pointer so we can also display the image
        # (read() consumes the file, seek(0) goes back to start)
        uploaded_file.seek(0)
        
        # Create a two-column layout: image on left, results on right
        col_img, col_data = st.columns([1, 2])  # 1:2 ratio
        
        with col_img:
            # Display the uploaded image
            st.subheader("🖼️ Uploaded Image")
            image = Image.open(uploaded_file)  # Load image with PIL
            st.image(image, use_container_width=True)  # Display scaled to container width
        
        with col_data:
            # -----------------------------------------
            # PROCESS BUTTON
            # -----------------------------------------
            # When clicked, runs OCR and AI extraction
            if st.button("🔍 Extract Receipt Data", use_container_width=True):
                
                # Step 1: Run OCR
                # st.spinner shows a loading indicator during processing
                with st.spinner("Extracting text from image..."):
                    # Call our OCR module (see ocr.py for implementation)
                    # This returns an OCRResult with text, psm, preprocessing info, and score
                    st.session_state.ocr_result = extract_text_from_image_bytes(
                        image_bytes, 
                        preprocess=enable_preprocessing
                    )
                
                # Step 2: Parse with AI
                with st.spinner("Parsing receipt with AI..."):
                    try:
                        # Call our extractor (see receipt_extractor.py)
                        # This sends OCR text to OpenAI and returns a validated Pydantic model
                        st.session_state.receipt = extract_and_validate_receipt(
                            st.session_state.ocr_result.text
                        )
                    except Exception as e:
                        # If AI parsing fails, show error but keep OCR results
                        st.error(f"Error parsing receipt: {str(e)}")
                        st.session_state.receipt = None
            
            # -----------------------------------------
            # DISPLAY RESULTS
            # -----------------------------------------
            # Results are stored in session state, so they persist after button click
            if st.session_state.ocr_result is not None:
                ocr_result = st.session_state.ocr_result
                
                # Show OCR metadata using native Streamlit
                st.success(f"✅ OCR Complete — PSM: {ocr_result.psm} | Preprocessed: {ocr_result.used_preprocess} | Score: {ocr_result.score}")
                
                # Show raw OCR text if enabled
                if show_raw_ocr:
                    st.subheader("📝 Raw OCR Output")
                    st.code(ocr_result.text, language=None)
                
                # Show structured receipt data if AI parsing succeeded
                if st.session_state.receipt is not None:
                    receipt = st.session_state.receipt
                    
                    st.subheader("📊 Extracted Data")
                    render_receipt_data(receipt)  # Call our rendering function
                    
                    # Show JSON output if enabled
                    if show_json:
                        st.subheader("🔧 JSON Output")
                        # model_dump() converts Pydantic model to dict, st.json displays it nicely
                        st.json(receipt.model_dump())
    else:
        # -----------------------------------------
        # EMPTY STATE (No file uploaded)
        # -----------------------------------------
        # Clear any previous results
        st.session_state.ocr_result = None
        st.session_state.receipt = None
        st.session_state.last_file_name = None
        
        # Show placeholder encouraging upload using native Streamlit
        st.info("📄 Upload a receipt image to get started. Supports PNG, JPG, JPEG, and WEBP formats.")


# ==============================================================================
# SCRIPT ENTRY POINT
# ==============================================================================
# This is Python's standard way to check if a script is being run directly
# (as opposed to being imported as a module).

if __name__ == "__main__":
    main()

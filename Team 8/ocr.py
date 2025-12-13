"""
================================================================================
OCR MODULE - Optical Character Recognition for Receipt Images
================================================================================
This module handles extracting text from receipt images using Tesseract OCR.

KEY FEATURES:
1. Image Preprocessing - Enhances image quality for better OCR results
2. Multiple PSM Modes - Tries different page segmentation modes to find best result
3. Quality Scoring - Automatically selects the best OCR output

WHAT IS OCR?
OCR (Optical Character Recognition) is the technology that converts images of 
text into machine-readable text. Tesseract is an open-source OCR engine 
originally developed by HP and now maintained by Google.

WHAT IS PSM?
PSM (Page Segmentation Mode) tells Tesseract how to interpret the image layout:
- PSM 3: Fully automatic page segmentation (default)
- PSM 4: Assume a single column of text of variable sizes
- PSM 6: Assume a single uniform block of text

WHY PREPROCESSING?
Receipt images often have:
- Poor lighting or shadows
- Low resolution
- Background noise
Preprocessing (grayscale, denoising, contrast) improves text recognition accuracy.

================================================================================
"""

from __future__ import annotations

import io               # For handling byte streams (image data in memory)
import re               # Regular expressions for pattern matching
import hashlib          # For creating file hashes (unique identifiers)
from dataclasses import dataclass  # Python's built-in class decorator for data structures

import numpy as np      # NumPy - numerical computing library for array operations
import cv2              # OpenCV - computer vision library for image processing
from PIL import Image   # Pillow - Python Imaging Library for basic image operations
import pytesseract      # Python wrapper for Tesseract OCR engine


# ==============================================================================
# DATA STRUCTURES
# ==============================================================================

@dataclass
class OCRResult:
    """
    Data class to store OCR results with metadata.
    
    A dataclass automatically generates __init__, __repr__, and other methods
    based on the class attributes defined below.
    
    Attributes:
        text: The extracted text from the image
        used_preprocess: Whether image preprocessing was applied
        psm: The Page Segmentation Mode that produced this result
        score: Quality score (higher = better quality text extraction)
    """
    text: str
    used_preprocess: bool
    psm: int
    score: int


# ==============================================================================
# IMAGE PREPROCESSING
# ==============================================================================

def preprocess_for_ocr(pil_img: Image.Image) -> Image.Image:
    """
    Apply image preprocessing to improve OCR accuracy.
    
    This function performs several image enhancements:
    1. Convert to grayscale (OCR works on black/white, color is noise)
    2. Upscale 2x (more pixels = more detail for text recognition)
    3. Denoise (remove speckles and noise)
    4. CLAHE contrast enhancement (make text stand out from background)
    
    Why these steps?
    - Grayscale: Tesseract works best on grayscale images
    - Upscaling: Higher resolution helps detect small text
    - Denoising: Removes artifacts that confuse character recognition
    - CLAHE: Adaptive contrast makes faded text more readable
    
    Args:
        pil_img: Input image as a PIL Image object
    
    Returns:
        Preprocessed image as a PIL Image (grayscale)
    
    Example:
        >>> img = Image.open("receipt.png")
        >>> processed = preprocess_for_ocr(img)
        >>> # processed is now enhanced for OCR
    """
    # Step 1: Convert PIL Image to NumPy array (OpenCV format)
    # PIL uses RGB order, OpenCV uses BGR, so we convert to RGB first
    rgb = np.array(pil_img.convert("RGB"))
    
    # Step 2: Convert RGB to Grayscale
    # Grayscale reduces 3 color channels to 1, simplifying analysis
    # Formula: Gray = 0.299*R + 0.587*G + 0.114*B (human perception weighted)
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

    # Step 3: Upscale image by 2x using cubic interpolation
    # INTER_CUBIC provides smoother scaling than INTER_LINEAR
    # fx=2.0, fy=2.0 means scale both width and height by 2
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    
    # Step 4: Apply Non-Local Means Denoising
    # This algorithm compares patches throughout the image to remove noise
    # h=10 is the filter strength (higher = more denoising but may blur text)
    gray = cv2.fastNlMeansDenoising(gray, h=10)

    # Step 5: Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    # Unlike global histogram equalization, CLAHE works on small tiles
    # This prevents over-amplification of noise while enhancing local contrast
    # clipLimit=2.0 limits contrast enhancement to prevent artifacts
    # tileGridSize=(8,8) divides image into 8x8 grid of tiles
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    # Convert back to PIL Image format for Tesseract
    return Image.fromarray(gray)


# ==============================================================================
# TESSERACT OCR EXECUTION
# ==============================================================================

def run_tesseract(pil_img: Image.Image, *, psm: int, lang: str = "eng") -> str:
    """
    Run Tesseract OCR on an image with specified settings.
    
    This function is a wrapper around pytesseract.image_to_string that:
    - Configures the PSM (Page Segmentation Mode)
    - Sets the language model
    - Cleans up the output text
    
    Args:
        pil_img: Image to process (PIL format)
        psm: Page Segmentation Mode (3, 4, or 6 for receipts)
        lang: Language code (default "eng" for English)
    
    Returns:
        Extracted text with form feed characters removed and whitespace trimmed.
    
    Note:
        The * in the function signature means psm and lang must be passed as
        keyword arguments: run_tesseract(img, psm=6) not run_tesseract(img, 6)
    """
    # Build Tesseract config string
    config = f"--psm {psm}"
    
    # Call Tesseract through pytesseract wrapper
    # image_to_string is the main OCR function
    text = pytesseract.image_to_string(pil_img, lang=lang, config=config)
    
    # Clean up output:
    # - Remove \x0c (form feed character that Tesseract sometimes adds)
    # - Strip leading/trailing whitespace
    return text.replace("\x0c", "").strip()


# ==============================================================================
# OCR QUALITY SCORING
# ==============================================================================

def ocr_quality_score(text: str) -> int:
    """
    Calculate a quality score for OCR output to identify the best result.
    
    Since we try multiple OCR configurations (different PSM modes, with/without
    preprocessing), we need a way to automatically select the best one.
    
    This scoring heuristic rewards:
    - Receipt-specific keywords (total, tax, subtotal, etc.)
    - Lines that look like "Item Name $12.34" patterns
    - Money amounts ($XX.XX format)
    - English words (actual text vs garbage)
    
    And penalizes:
    - Unusual/garbage characters
    - Fragmented single-word lines (often OCR errors)
    - Known junk patterns (like "eee", "www")
    - Excessive line counts (fragmentation)
    
    Args:
        text: OCR output text to score
    
    Returns:
        Integer score (higher = better quality)
    
    Example:
        >>> score1 = ocr_quality_score("GROCERY STORE\\nMilk $3.50\\nTotal $3.50")
        >>> score2 = ocr_quality_score("G R O C E R Y\\nM i l k\\n3 5 0")
        >>> score1 > score2  # First is clearly better OCR
        True
    """
    # Clean the text
    t = text.replace("\x0c", "").strip()
    
    # Empty text gets a very low score
    if not t:
        return -10

    # Split into non-empty lines for analysis
    lines = [ln.strip() for ln in t.splitlines() if ln.strip()]
    num_lines = len(lines)

    # -----------------------------------------
    # PATTERN MATCHING
    # -----------------------------------------
    
    # Find English words (2+ letters) - indicates real text
    words = re.findall(r"[A-Za-z]{2,}", t)
    
    # Find money-like patterns: $12.34, 12.34, €5,00
    # (?:...) is a non-capturing group
    money_like = re.findall(r"(?:[$€£]\s?)?\d+(?:[.,]\d{2})", t)
    
    # Find weird/garbage characters (not alphanumeric, spaces, or common punctuation)
    weird = re.findall(r"[^A-Za-z0-9\s\.\,\:\-\$€£/]", t)

    # -----------------------------------------
    # REWARD: Receipt Keywords
    # -----------------------------------------
    # These words strongly indicate this is receipt text
    keywords = 0
    for k in ["total", "subtotal", "sub-total", "tax", "amount", "date", "tel", "balance", "receipt"]:
        if k in t.lower():
            keywords += 6  # Each keyword adds 6 points

    # -----------------------------------------
    # REWARD: Item + Price Lines
    # -----------------------------------------
    # Lines like "Milk 3.50" or "Coffee $4.25" are very good signals
    # Pattern: some letters, then digits ending in .XX
    item_price_lines = 0
    for ln in lines:
        if re.search(r"[A-Za-z].*\d+(?:[.,]\d{2})\b", ln):
            item_price_lines += 1

    # -----------------------------------------
    # PENALTY: Fragmentation
    # -----------------------------------------
    # Many single-word lines often indicates poor OCR (words got split)
    single_word_lines = sum(1 for ln in lines if len(ln.split()) == 1)
    fragmentation_penalty = int(2.5 * single_word_lines)

    # -----------------------------------------
    # PENALTY: Junk Lines
    # -----------------------------------------
    # Common OCR garbage patterns
    junk_lines = 0
    for ln in lines:
        if len(ln) <= 4 and re.fullmatch(r"[A-Za-z]{2,4}", ln) and ln.lower() in {"eee", "ewe", "www", "wun", "wunuu", "wunuuui"}:
            junk_lines += 1
    junk_penalty = 10 * junk_lines

    # -----------------------------------------
    # PENALTY: Too Many Lines
    # -----------------------------------------
    # Receipts usually don't have 50+ lines; excessive lines suggest fragmentation
    too_many_lines_penalty = max(0, num_lines - 25)

    # -----------------------------------------
    # CALCULATE FINAL SCORE
    # -----------------------------------------
    score = (
        keywords +                    # +6 per receipt keyword found
        item_price_lines * 8 +        # +8 per "item price" line pattern
        len(money_like) * 2 +         # +2 per money amount found
        len(words) -                  # +1 per English word
        len(weird) * 2 -              # -2 per garbage character
        fragmentation_penalty -        # -2.5 per single-word line
        junk_penalty -                # -10 per junk pattern
        too_many_lines_penalty        # -1 per line over 25
    )
    return score


# ==============================================================================
# MAIN OCR EXTRACTION FUNCTION
# ==============================================================================

def extract_text_from_image_bytes(
    image_bytes: bytes,
    *,
    lang: str = "eng",
    preprocess: bool = True,
) -> OCRResult:
    """
    Extract text from image bytes using the best OCR configuration.
    
    This is the main public function of the OCR module. It:
    1. Tries multiple PSM (Page Segmentation Mode) settings
    2. Optionally tries with and without preprocessing
    3. Scores each result and returns the best one
    
    Why try multiple configurations?
    Different receipt layouts work better with different PSM modes:
    - PSM 3: Good for complex layouts with multiple columns
    - PSM 4: Good for single column, variable font sizes
    - PSM 6: Good for uniform text blocks
    
    Args:
        image_bytes: Raw image file bytes (e.g., from file.read())
        lang: Tesseract language code (default "eng")
        preprocess: Whether to try preprocessed versions (default True)
    
    Returns:
        OCRResult containing the best extraction result
    
    Example:
        >>> with open("receipt.png", "rb") as f:
        ...     image_bytes = f.read()
        >>> result = extract_text_from_image_bytes(image_bytes)
        >>> print(result.text)
        GROCERY STORE
        Milk $3.50
        Total $3.50
    """
    # Load image from bytes into PIL format
    pil_img = Image.open(io.BytesIO(image_bytes))

    # Receipt-friendly PSM modes to try
    try_psm = (3, 4, 6)

    # Collect all candidate results
    candidates: list[OCRResult] = []

    # -----------------------------------------
    # ATTEMPT 1: Original image (no preprocessing)
    # -----------------------------------------
    for psm in try_psm:
        t = run_tesseract(pil_img, psm=psm, lang=lang)
        candidates.append(OCRResult(
            text=t, 
            used_preprocess=False, 
            psm=psm, 
            score=ocr_quality_score(t)
        ))

    # -----------------------------------------
    # ATTEMPT 2: Preprocessed image
    # -----------------------------------------
    if preprocess:
        pimg = preprocess_for_ocr(pil_img)
        for psm in try_psm:
            t = run_tesseract(pimg, psm=psm, lang=lang)
            candidates.append(OCRResult(
                text=t, 
                used_preprocess=True, 
                psm=psm, 
                score=ocr_quality_score(t)
            ))

    # Select the candidate with the highest quality score
    best = max(candidates, key=lambda r: r.score)
    return best


# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

def sha256_bytes(b: bytes) -> str:
    """
    Generate SHA-256 hash of bytes for unique file identification.
    
    This is useful for caching OCR results - same image = same hash.
    
    Args:
        b: Bytes to hash
    
    Returns:
        Hexadecimal string of the SHA-256 hash (64 characters)
    """
    return hashlib.sha256(b).hexdigest()

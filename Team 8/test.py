from __future__ import annotations

import io
import re
import hashlib
from dataclasses import dataclass

import numpy as np
import cv2
from PIL import Image
import pytesseract


@dataclass
class OCRResult:
    text: str
    used_preprocess: bool
    psm: int
    score: int


def preprocess_for_ocr(pil_img: Image.Image) -> Image.Image:
    """
    Mild preprocessing for screenshots/receipts:
    grayscale -> upscale -> denoise -> CLAHE contrast.
    (No hard thresholding.)
    """
    rgb = np.array(pil_img.convert("RGB"))
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    gray = cv2.fastNlMeansDenoising(gray, h=10)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    return Image.fromarray(gray)


def run_tesseract(pil_img: Image.Image, *, psm: int, lang: str = "eng") -> str:
    config = f"--psm {psm}"
    text = pytesseract.image_to_string(pil_img, lang=lang, config=config)
    return text.replace("\x0c", "").strip()


def ocr_quality_score(text: str) -> int:
    """
    Better heuristic:
    - rewards presence of receipt keywords and money
    - rewards lines that look like "Item 12.34"
    - penalizes junk lines (eee, random)
    - penalizes too many single-word lines (fragmentation)
    """
    t = text.replace("\x0c", "").strip()
    if not t:
        return -10

    lines = [ln.strip() for ln in t.splitlines() if ln.strip()]
    num_lines = len(lines)

    # Token patterns
    words = re.findall(r"[A-Za-z]{2,}", t)
    money_like = re.findall(r"(?:[$€£]\s?)?\d+(?:[.,]\d{2})", t)
    weird = re.findall(r"[^A-Za-z0-9\s\.\,\:\-\$€£/]", t)

    # Receipt keywords
    keywords = 0
    for k in ["total", "subtotal", "sub-total", "tax", "amount", "date", "tel", "balance", "receipt"]:
        if k in t.lower():
            keywords += 6

    # Lines that look like "ItemName 12.34" (great signal)
    item_price_lines = 0
    for ln in lines:
        if re.search(r"[A-Za-z].*\d+(?:[.,]\d{2})\b", ln):
            item_price_lines += 1

    # Fragmentation penalty: many single-word lines = bad
    single_word_lines = sum(1 for ln in lines if len(ln.split()) == 1)
    fragmentation_penalty = int(2.5 * single_word_lines)

    # Junk line penalty: repeated short nonsense like "eee"
    junk_lines = 0
    for ln in lines:
        if len(ln) <= 4 and re.fullmatch(r"[A-Za-z]{2,4}", ln) and ln.lower() in {"eee", "ewe", "www", "wun", "wunuu", "wunuuui"}:
            junk_lines += 1
    junk_penalty = 10 * junk_lines

    # Mild penalty if there are *too many* lines (often means fragmentation)
    too_many_lines_penalty = max(0, num_lines - 25)

    score = (
        keywords +
        item_price_lines * 8 +
        len(money_like) * 2 +
        len(words) -
        len(weird) * 2 -
        fragmentation_penalty -
        junk_penalty -
        too_many_lines_penalty
    )
    return score


def extract_text_from_image_bytes(
    image_bytes: bytes,
    *,
    lang: str = "eng",
    preprocess: bool = True,
) -> OCRResult:
    """
    For receipts, restrict PSM to layout-friendly modes.
    """
    pil_img = Image.open(io.BytesIO(image_bytes))

    # Receipt-friendly modes
    try_psm = (3, 4, 6)

    candidates: list[OCRResult] = []

    # Original candidates
    for psm in try_psm:
        t = run_tesseract(pil_img, psm=psm, lang=lang)
        candidates.append(OCRResult(text=t, used_preprocess=False, psm=psm, score=ocr_quality_score(t)))

    # Preprocessed candidates
    if preprocess:
        pimg = preprocess_for_ocr(pil_img)
        for psm in try_psm:
            t = run_tesseract(pimg, psm=psm, lang=lang)
            candidates.append(OCRResult(text=t, used_preprocess=True, psm=psm, score=ocr_quality_score(t)))

    best = max(candidates, key=lambda r: r.score)
    return best


def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


if __name__ == "__main__":
    path = "receipt.png"
    with open(path, "rb") as f:
        b = f.read()

    best = extract_text_from_image_bytes(b, preprocess=True)

    print(f"asset_hash={sha256_bytes(b)[:12]}...")
    print(f"best_psm={best.psm} used_preprocess={best.used_preprocess} score={best.score}")
    print("----- OCR TEXT START -----")
    print(best.text)
    print("----- OCR TEXT END -----")

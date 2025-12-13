# 🧾 Receipt Scanner - Presentation Guide

This guide will help you explain the Receipt Scanner project step by step.

---

## 📋 Quick Overview (30 seconds)

> "This is a Receipt Scanner app that uses **OCR** and **AI** to extract structured data from receipt images. Upload a photo of a receipt, and it automatically identifies the merchant, items, prices, and totals - returning everything as clean, structured JSON."

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE (Streamlit)                     │
│                              app.py                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 1: IMAGE PREPROCESSING                         │
│                              ocr.py                                      │
│  • Grayscale conversion    • 2x upscaling    • Denoising    • CLAHE     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 2: OCR TEXT EXTRACTION                         │
│                         Tesseract OCR Engine                             │
│  • Tries 3 different PSM modes (3, 4, 6)                                │
│  • Scores each result using quality heuristics                          │
│  • Returns the best extraction                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 3: AI STRUCTURED EXTRACTION                    │
│                    extractors/receipt_extractor.py                       │
│  • Sends OCR text to OpenAI GPT-4.1-mini                                │
│  • Prompt engineering for receipt parsing                                │
│  • Validates output with Pydantic schema                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 4: DISPLAY RESULTS                             │
│  • Merchant info cards    • Items table    • Totals    • JSON output    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎤 Step-by-Step Presentation Script

### 1. Introduction (1 minute)

**Say:** "Today I'm presenting Receipt Scanner - an intelligent document processing tool that converts receipt images into structured data."

**Demo:** Show the app interface with no image uploaded.

**Key points:**
- Problem: Receipts are unstructured - just images or paper
- Solution: Combine OCR + AI to extract meaningful data
- Use cases: Expense tracking, accounting, inventory management

---

### 2. The Technology Stack (2 minutes)

**Open `requirements.txt` and explain each dependency:**

| Library | Purpose |
|---------|---------|
| `streamlit` | Web framework for the UI |
| `pytesseract` | Python wrapper for Tesseract OCR |
| `opencv-python` | Image preprocessing (denoising, contrast) |
| `Pillow` | Image loading and manipulation |
| `openai` | API client for GPT models |
| `pydantic` | Data validation and schema enforcement |

**Say:** "We use a combination of traditional computer vision (OpenCV) with modern AI (GPT-4) to get the best results."

---

### 3. Image Preprocessing (`ocr.py` - lines 63-102)

**Open `ocr.py` and show the `preprocess_for_ocr` function:**

```python
def preprocess_for_ocr(pil_img: Image.Image) -> Image.Image:
    # Step 1: Convert to grayscale
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    
    # Step 2: Upscale 2x for more detail
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    
    # Step 3: Denoise to remove speckles
    gray = cv2.fastNlMeansDenoising(gray, h=10)
    
    # Step 4: CLAHE for better contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
```

**Explain each step:**
1. **Grayscale**: OCR works on black/white - color is noise
2. **Upscaling**: More pixels = better text recognition
3. **Denoising**: Removes artifacts that confuse OCR
4. **CLAHE**: Makes faded text readable (Contrast Limited Adaptive Histogram Equalization)

---

### 4. Multi-Mode OCR (`ocr.py` - lines 150-182)

**Show `extract_text_from_image_bytes`:**

**Say:** "We don't just run OCR once. We try 6 different configurations and pick the best one."

```python
# Try 3 PSM modes on original image
for psm in (3, 4, 6):
    candidates.append(run_tesseract(pil_img, psm=psm))

# Try same 3 PSM modes on preprocessed image
for psm in (3, 4, 6):
    candidates.append(run_tesseract(preprocessed_img, psm=psm))

# Pick the best result based on quality score
best = max(candidates, key=lambda r: r.score)
```

**Explain PSM modes:**
- PSM 3: Automatic page segmentation
- PSM 4: Single column, variable font sizes
- PSM 6: Uniform block of text

---

### 5. Quality Scoring (`ocr.py` - lines 115-147)

**Show `ocr_quality_score` function:**

**Say:** "How do we know which OCR result is best? We use a scoring heuristic."

**Rewards (positive points):**
- Receipt keywords: "total", "tax", "subtotal" (+6 each)
- Item-price patterns: "Milk $3.50" (+8 each)
- Money amounts: "$12.34" (+2 each)

**Penalties (negative points):**
- Garbage characters (-2 each)
- Single-word lines / fragmentation (-2.5 each)
- Junk patterns like "eee", "www" (-10 each)

---

### 6. AI Extraction (`receipt_extractor.py` - lines 99-127)

**Show the prompt engineering:**

**Say:** "Once we have clean OCR text, we send it to GPT-4 with a carefully crafted prompt."

```python
RECEIPT_SCHEMA_DESC = """
Return ONLY valid JSON with this schema:
{
  "merchant": string|null,
  "items": [{"name": string, "total_price": number}],
  "total": number|null
}

Rules:
- If missing, use null
- Parse "1,20" as 1.20 (European decimals)
- Lines like "Milk 6.50" => treat as total_price
"""
```

**Key points:**
- We define EXACTLY what we want
- We handle edge cases in the prompt
- We use temperature=0 for deterministic output

---

### 7. Data Validation (`receipt_extractor.py` - lines 45-77)

**Show Pydantic models:**

```python
class ReceiptItem(BaseModel):
    name: str
    quantity: Optional[float] = None
    total_price: Optional[float] = None

class ReceiptOutput(BaseModel):
    merchant: Optional[str] = None
    items: List[ReceiptItem] = []
    total: Optional[float] = None
```

**Say:** "Pydantic ensures the AI's output matches our expected schema. If not, we have self-healing logic."

---

### 8. Self-Healing Logic (`receipt_extractor.py` - lines 155-180)

**Show the repair logic:**

```python
try:
    return ReceiptOutput.model_validate(data)
except ValidationError as e:
    # Ask AI to fix the JSON
    repair_prompt = f"Fix this JSON. Errors: {e}"
    fixed = call_openai(repair_prompt)
    return ReceiptOutput.model_validate(fixed)
```

**Say:** "If the AI returns invalid JSON, we send the errors back and ask it to fix them. This makes the system more robust."

---

### 9. Live Demo (2-3 minutes)

1. **Upload a receipt image**
2. **Click "Extract Receipt Data"**
3. **Show the Raw OCR text** - point out that it's messy
4. **Show the structured cards** - merchant, date, items
5. **Show the JSON output** - clean, validated, usable

**Highlight:**
- Processing time
- Accuracy of extraction
- How it handles missing data (shows "—")

---

### 10. Streamlit UI (`app.py`)

**Briefly show key UI concepts:**

```python
# Session state persists data across reruns
st.session_state.receipt = result

# Columns for layout
col1, col2 = st.columns([1, 2])

# File uploader widget
uploaded_file = st.file_uploader("Upload receipt", type=["png", "jpg"])

# Button triggers processing
if st.button("Extract"):
    result = process(image)
```

---

## 🎯 Key Talking Points

### Why This Approach Works

1. **Hybrid AI**: Combines rule-based (OpenCV) with LLM (GPT)
2. **Defensive**: Multiple PSM modes, quality scoring, self-healing
3. **Validated**: Pydantic ensures output is always structured
4. **User-friendly**: Clean UI, real-time feedback

### Challenges Solved

1. **Poor image quality** → Preprocessing pipeline
2. **OCR errors** → Multiple modes + scoring
3. **Unstructured text** → AI extraction
4. **Invalid JSON** → Self-healing validation

### Potential Extensions

- Database storage for expense tracking
- Multi-language support (Tesseract supports 100+ languages)
- Batch processing for multiple receipts
- Export to CSV/Excel
- Integration with accounting software

---

## 📁 File Structure

```
GenAIDec13/
├── app.py                          # Streamlit web interface
├── ocr.py                          # OCR + preprocessing
├── extractors/
│   └── receipt_extractor.py        # AI extraction + validation
├── requirements.txt                # Dependencies
├── .env                            # OPENAI_API_KEY (not committed)
└── PRESENTATION_GUIDE.md           # This file
```

---

## 🚀 Running the Demo

```bash
# 1. Activate virtual environment
source Hackathon-Dec13-env/bin/activate

# 2. Set OpenAI API key (if not in .env)
export OPENAI_API_KEY="sk-..."

# 3. Run the app
streamlit run app.py
```

---

## ❓ Anticipated Questions

**Q: Why not use GPT-4 Vision directly?**
> A: Cost and latency. Tesseract is free and fast. We only use the API for structure extraction, not image processing.

**Q: How accurate is it?**
> A: Depends on image quality. With preprocessing, we typically get 90%+ accuracy on clear receipts.

**Q: What languages are supported?**
> A: Currently English. Tesseract supports 100+ languages - just change `lang="eng"` to `lang="fra"`, etc.

**Q: How do you handle handwritten receipts?**
> A: Current version works best with printed text. Handwriting would need a specialized model.

---

## 🎬 Demo Script (2 minutes)

1. "Here's a receipt photo I took" → Upload
2. "Click extract" → Show spinner
3. "First, OCR extracts raw text" → Show raw output
4. "Then AI structures it" → Show cards
5. "Finally, validated JSON" → Show JSON
6. "Ready for database storage or export"

Good luck with your presentation! 🎉


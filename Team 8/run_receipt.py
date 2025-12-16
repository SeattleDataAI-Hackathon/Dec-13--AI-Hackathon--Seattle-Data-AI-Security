from ocr import extract_text_from_image_bytes
from extractors.receipt_extractor import extract_and_validate_receipt
import json 

if __name__ == "__main__":
    with open("receipt2.png", "rb") as f:  # <-- change here
        b = f.read()

    ocr_res = extract_text_from_image_bytes(b, preprocess=True)

    print("OCR used_preprocess:", ocr_res.used_preprocess, "psm:", ocr_res.psm)
    print("---- OCR TEXT ----")
    print(ocr_res.text)
    print("---- END OCR TEXT ----")

    receipt = extract_and_validate_receipt(ocr_res.text)
    print(json.dumps(receipt.model_dump(), indent=2))

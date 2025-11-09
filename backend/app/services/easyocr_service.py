import easyocr

# Initialize multilingual reader (English + Hindi)
reader = easyocr.Reader(["en", "hi"])

def extract_text_easyocr(image_path: str) -> str:
    results = reader.readtext(image_path, detail=0)
    return "\n".join(results)

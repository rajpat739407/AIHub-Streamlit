import pytesseract
from PIL import Image

# Optional: set path if not in system PATH
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_pytesseract(image_path: str):
    img = Image.open(image_path)
    try:
        # Use both English and Hindi
        text = pytesseract.image_to_string(img, lang="eng+hin")
        return text.strip()
    except pytesseract.TesseractError as e:
        return f"Error: {str(e)}"

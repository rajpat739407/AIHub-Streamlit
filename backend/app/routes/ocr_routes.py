from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import os
from app.utils.file_utils import save_upload_file
from app.services.easyocr_service import extract_text_easyocr
from app.services.pytesseract_service import extract_text_pytesseract


router = APIRouter(prefix="/ocr", tags=["OCR"])
UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/extract")
async def extract_text(file: UploadFile = File(...), method: str = "easyocr"):
    try:
        file_path = save_upload_file(file, UPLOAD_DIR)

        if method == "easyocr":
            text = extract_text_easyocr(file_path)
        elif method == "pytesseract":
            text = extract_text_pytesseract(file_path)
        else:
            return JSONResponse(status_code=400, content={"error": "Invalid method"})

        return {"method": method, "text": text}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

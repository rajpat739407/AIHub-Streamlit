from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

processor = TrOCRProcessor.from_pretrained("google/multilingual-trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("google/multilingual-trocr-base-handwritten")

def extract_text_hindi_transformer(image_path: str):
    image = Image.open(image_path).convert("RGB")
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return text.strip()

# backend/app/routes/text_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.textgen_service import generate_text

router = APIRouter(prefix="/text", tags=["Text Generation"])

class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="Text prompt to begin generation")
    max_length: int = Field(120, ge=10, le=2048)
    temperature: float = Field(1.0, ge=0.1, le=2.0)
    top_k: int = Field(50, ge=0, le=1000)
    top_p: float = Field(0.95, ge=0.0, le=1.0)
    num_return_sequences: int = Field(1, ge=1, le=5)
    trim_prompt: Optional[bool] = Field(False, description="If true, strip the prompt from returned text")

class GenerateResponse(BaseModel):
    prompt: str
    results: List[str]

@router.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    if not req.prompt or len(req.prompt.strip()) == 0:
        raise HTTPException(status_code=400, detail="prompt must not be empty")
    try:
        outputs = generate_text(
            prompt=req.prompt,
            max_length=req.max_length,
            temperature=req.temperature,
            top_k=req.top_k,
            top_p=req.top_p,
            num_return_sequences=req.num_return_sequences
        )
        if req.trim_prompt:
            # remove the prompt prefix from the generated texts if present
            trimmed = []
            for t in outputs:
                if t.startswith(req.prompt):
                    trimmed.append(t[len(req.prompt):].lstrip())
                else:
                    trimmed.append(t)
            outputs = trimmed

        return {"prompt": req.prompt, "results": outputs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

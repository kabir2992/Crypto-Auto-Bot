from fastapi import FastAPI, UploadFile, File
from vision.extractText import extract_text_from_image
import shutil
import os

app = FastAPI()

SCREENSHOT_DIR = "screenshot"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

@app.get("/")
def home():
    return { "message" : "Python AI Service Running" }
@app.post("/analyze")
async def analyze_chart(file : UploadFile = File(...)) :
    file_path = f"{SCREENSHOT_DIR}/{file.filename}"
    
    with open(file_path, "wb") as buffer :
        shutil.copyfileobj(file.file, buffer)

        extracted_text = extract_text_from_image(file_path)

        return { "success": True, "text": extracted_text }

import pytesseract
from PIL import Image
import os

pytesseract.pytesseract.tesseract_cmd = '/opt/local/bin/tesseract'
os.environ['TESSDATA_PREFIX'] = '/opt/local/share/tessdata/'

def extract_text_from_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    
    extracted = []
    for line in text.splitlines():
        line = line.strip()
        if line:
            extracted.append(line)
    
    return extracted
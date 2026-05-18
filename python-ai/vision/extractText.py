from google.cloud import vision

client = vision.ImageAnnotatorClient()

def extract_text_from_image(image_path):

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)

    texts = response.text_annotations

    extracted = []

    for text in texts:
        extracted.append(text.description)

    return extracted
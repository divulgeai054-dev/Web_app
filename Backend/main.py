from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import torch
import numpy as np
import cv2
import uvicorn
import base64

from model import load_model, DEVICE
from preprocessing import preprocess_image
from pdf_generator import create_pdf_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = load_model()

CLASS_NAMES = {
    0: "Background",
    1: "Bone Level",
    2: "Decayed Teeth",
    3: "Healthy Teeth",
    4: "Implant",
    5: "Restoration"
}

COLORS = np.array([
    [0, 0, 0],
    [100, 149, 237],
    [220, 80, 80],
    [100, 200, 120],
    [240, 220, 130],
    [150, 100, 70]
], dtype=np.uint8)


class AppointmentRequest(BaseModel):
    patientName: str = ""
    patientPhone: str = ""
    doctorId: str = ""
    date: str = ""
    slot: str = ""


def image_to_tensor(image):
    img = image.astype(np.float32) / 255.0
    img = np.stack([img] * 3, axis=-1)
    img = (img - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    img = np.transpose(img, (2, 0, 1))
    return torch.tensor(img, dtype=torch.float32).unsqueeze(0)


def extract_findings(pred_mask, min_area=150):
    counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    for class_id in range(1, 6):
        binary = (pred_mask == class_id).astype(np.uint8)
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
            binary, connectivity=8
        )

        for i in range(1, num_labels):
            if stats[i, cv2.CC_STAT_AREA] >= min_area:
                counts[class_id] += 1

    return counts


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_image = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        if image is None:
            return JSONResponse(status_code=400, content={"error": "Invalid image"})

        original, processed, stats = preprocess_image(image)

        input_tensor = image_to_tensor(processed).to(DEVICE)

        with torch.no_grad():
            logits = model(input_tensor)
            prediction = torch.argmax(
                torch.softmax(logits, dim=1), dim=1
            ).squeeze().cpu().numpy()

        processed_rgb = np.stack([processed] * 3, axis=-1)
        pred_color = COLORS[prediction].astype(np.uint8)

        overlay = cv2.addWeighted(
            processed_rgb.astype(np.uint8),
            0.6,
            pred_color,
            0.5,
            0
        )

        findings = extract_findings(prediction)

        create_pdf_report(
            hosp_name="DivulgeAI Dental Hospital",
            doc_name="Dr. Mayur",
            hosp_phone="+1 (800) 123-4567",
            hosp_email="care@hospital.com",
            pat_name="Patient",
            pat_age="30",
            pat_phone="1234567890",
            pat_notes="Routine Dental Checkup",
            conf_score=97.4,
            region_counts=findings,
            class_names=CLASS_NAMES,
            original_image=image,
            preprocessed_image=processed_rgb,
            overlay_image=overlay,
            comp_phone="+1 (800) DIVULGE",
            comp_email="support@divulgeai.com"
        )

        _, original_buffer = cv2.imencode(".png", image)
        _, processed_buffer = cv2.imencode(".png", processed)
        _, overlay_buffer = cv2.imencode(".png", overlay)

        return JSONResponse(
            content={
                "message": "Prediction Successful",
                "statistics": stats,
                "findings": findings,
                "original_image": base64.b64encode(original_buffer).decode("utf-8"),
                "preprocessed_image": base64.b64encode(processed_buffer).decode("utf-8"),
                "segmentation_image": base64.b64encode(overlay_buffer).decode("utf-8")
            }
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/download-report")
async def download_report():
    return FileResponse(
        path="Dental_Report.pdf",
        filename="Dental_Report.pdf",
        media_type="application/pdf"
    )


@app.get("/api/appointments/slots")
async def get_appointment_slots(doctorId: str, date: str):
    return {
        "success": True,
        "doctorId": doctorId,
        "date": date,
        "slots": [
            {"id": 1, "time": "09:00 AM", "available": True},
            {"id": 2, "time": "10:00 AM", "available": True},
            {"id": 3, "time": "11:00 AM", "available": False},
            {"id": 4, "time": "02:00 PM", "available": True},
            {"id": 5, "time": "03:00 PM", "available": True}
        ]
    }


@app.post("/api/appointments")
async def create_appointment(data: AppointmentRequest):
    return {
        "success": True,
        "message": "Appointment booked successfully",
        "appointment": data.model_dump()
    }


@app.get("/")
async def root():
    return {"message": "Dental Segmentation API Running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

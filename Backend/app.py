import streamlit as st

# ✅ MUST BE FIRST STREAMLIT COMMAND
st.set_page_config(layout="wide")

import torch
import numpy as np
import cv2
from PIL import Image
import segmentation_models_pytorch as smp

# ==============================
# CONFIG
# ==============================
MODEL_PATH = "dental_unet_resnet50.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CLASS_NAMES = {
    0: "Background",
    1: "Bone",
    2: "Decayed Teeth",
    3: "Healthy Teeth",
    4: "Implant Teeth",
    5: "Restored Teeth"
}

NUM_CLASSES = len(CLASS_NAMES)

# ✅ SOFT MEDICAL COLORS
COLORS = np.array([
    [0, 0, 0],        # Background
    [100, 149, 237],  # Bone (soft blue)
    [220, 80, 80],    # Decayed (soft red)
    [100, 200, 120],  # Healthy (soft green)
    [240, 220, 130],  # Implant (soft yellow)
    [150, 100, 70]    # Restored (soft brown)
], dtype=np.uint8)

# ==============================
# LOAD MODEL
# ==============================
@st.cache_resource
def load_model():
    model = smp.Unet(
        encoder_name="resnet50",
        encoder_weights=None,
        in_channels=3,
        classes=NUM_CLASSES
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

model = load_model()

# ==============================
# PREPROCESS
# ==============================
def preprocess(image):
    image = cv2.resize(image, (512, 512))
    image = image.astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])

    image = (image - mean) / std
    image = np.transpose(image, (2, 0, 1))

    return torch.tensor(image, dtype=torch.float32).unsqueeze(0)

# ==============================
# UTILS
# ==============================
def decode_mask(mask):
    return COLORS[mask].astype(np.uint8)  # ✅ dtype fixed

def overlay(image, mask):
    image = image.astype(np.uint8)
    mask = mask.astype(np.uint8)
    return cv2.addWeighted(image, 0.75, mask, 0.25, 0)

# ==============================
# UI
# ==============================
st.title("🦷 Dental Segmentation Viewer (Medical Style)")

uploaded_file = st.file_uploader("Upload Dental Image", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    image = np.array(Image.open(uploaded_file).convert("RGB"))
    image_resized = cv2.resize(image, (512, 512))

    # ==============================
    # INFERENCE
    # ==============================
    input_tensor = preprocess(image).to(DEVICE)

    with torch.no_grad():
        logits = model(input_tensor)
        probs = torch.softmax(logits, dim=1)

        pred = torch.argmax(probs, dim=1).squeeze().cpu().numpy()
        probs = probs.squeeze().cpu().numpy()

    pred_color = decode_mask(pred)
    overlay_img = overlay(image_resized, pred_color)

    # ==============================
    # DISPLAY
    # ==============================
    col1, col2, col3 = st.columns(3)

    with col1:
        st.subheader("Original")
        st.image(image_resized)

    with col2:
        st.subheader("Segmentation")
        st.image(pred_color)

    with col3:
        st.subheader("Overlay")
        st.image(overlay_img)

    # ==============================
    # CONFIDENCE MAP
    # ==============================
    confidence = np.max(probs, axis=0)

    st.subheader("Confidence Map")
    st.image(confidence, clamp=True)

    # ==============================
    # CLASS-WISE VIEW
    # ==============================
    st.subheader("Class-wise Analysis")

    selected_class = st.selectbox(
        "Select Class",
        list(CLASS_NAMES.keys()),
        format_func=lambda x: CLASS_NAMES[x]
    )

    class_mask = (pred == selected_class).astype(np.uint8) * 255
    class_prob = probs[selected_class]

    c1, c2 = st.columns(2)

    with c1:
        st.image(class_mask, caption=f"{CLASS_NAMES[selected_class]} Mask")

    with c2:
        st.image(class_prob, caption=f"{CLASS_NAMES[selected_class]} Confidence", clamp=True)

# ==============================
# LEGEND
# ==============================
st.sidebar.title("Legend")

for i, name in CLASS_NAMES.items():
    color = COLORS[i]
    st.sidebar.markdown(
        f"<div style='display:flex;align-items:center;'>"
        f"<div style='width:20px;height:20px;background-color:rgb{tuple(color)};margin-right:10px;'></div>"
        f"{name}</div>",
        unsafe_allow_html=True
    )
import torch
import segmentation_models_pytorch as smp

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

MODEL_PATH = "dental_unet_resnet50.pth"

CLASS_NAMES = {

    0: "Background",

    1: "Bone Level",

    2: "Decayed Teeth",

    3: "Healthy Teeth",

    4: "Implant",

    5: "Restoration"

}

def load_model():

    model = smp.Unet(

        encoder_name="resnet50",

        encoder_weights=None,

        in_channels=3,

        classes=len(CLASS_NAMES)

    )

    model.load_state_dict(

        torch.load(
            MODEL_PATH,
            map_location=DEVICE
        )

    )

    model.to(DEVICE)

    model.eval()

    return model
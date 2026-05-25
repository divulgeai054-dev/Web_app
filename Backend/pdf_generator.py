from fpdf import FPDF
import cv2
import tempfile
import datetime
import os

# ==========================================
# LOGO PATHS
# ==========================================

LOGO_1_PATH = r"C:\Users\ASUS\OneDrive\Desktop\AI MODEL INTEGRATION\image\Logo_1.png"

LOGO_2_PATH = r"C:\Users\ASUS\OneDrive\Desktop\AI MODEL INTEGRATION\image\Logo_2.png"

# ==========================================
# PDF REPORT
# ==========================================

def create_pdf_report(

    hosp_name,
    doc_name,
    hosp_phone,
    hosp_email,
    pat_name,
    pat_age,
    pat_phone,
    pat_notes,
    conf_score,
    region_counts,
    class_names,
    original_image,
    preprocessed_image,
    overlay_image,
    comp_phone,
    comp_email

):

    pdf = FPDF()

    pdf.add_page()

    pdf.set_auto_page_break(auto=False)

    pdf.set_text_color(15, 23, 42)

    # ======================================
    # HEADER LOGO
    # ======================================

    try:

        if os.path.exists(LOGO_1_PATH):

            pdf.image(

                LOGO_1_PATH,

                x=160,

                y=10,

                w=32

            )

    except Exception as e:

        print(e)

    # ======================================
    # HEADER
    # ======================================

    pdf.set_y(18)

    pdf.set_font("Times", 'B', 24)

    pdf.cell(

        0,

        10,

        hosp_name,

        ln=True,

        align='C'

    )

    pdf.set_font("Times", 'B', 15)

    pdf.cell(

        0,

        8,

        f"Attending Doctor: {doc_name}",

        ln=True,

        align='C'

    )

    pdf.set_font("Times", '', 12)

    pdf.cell(

        0,

        6,

        f"Phone: {hosp_phone} | Email: {hosp_email}",

        ln=True,

        align='C'

    )

    pdf.cell(

        0,

        6,

        f"Date: {datetime.datetime.now().strftime('%B %d, %Y')}",

        ln=True,

        align='C'

    )

    pdf.ln(18)

    # ======================================
    # PATIENT DETAILS
    # ======================================

    pdf.set_font("Times", 'B', 16)

    pdf.set_text_color(13, 148, 136)

    pdf.cell(

        200,

        10,

        "PATIENT DETAILS",

        ln=True

    )

    pdf.set_text_color(15, 23, 42)

    pdf.set_font("Times", '', 12)

    pdf.cell(

        200,

        7,

        f"Name: {pat_name}",

        ln=True

    )

    pdf.cell(

        200,

        7,

        f"Age: {pat_age} | Phone: {pat_phone}",

        ln=True

    )

    pdf.multi_cell(

        0,

        7,

        f"Notes: {pat_notes}"

    )

    pdf.ln(10)

    # ======================================
    # SCAN ANALYSIS
    # ======================================

    pdf.set_font("Times", 'B', 16)

    pdf.set_text_color(13, 148, 136)

    pdf.cell(

        200,

        10,

        "SCAN ANALYSIS",

        ln=True

    )

    pdf.set_text_color(15, 23, 42)

    y_position = pdf.get_y()

    w_img = 50

    spacing = 12

    total_width = (3 * w_img) + (2 * spacing)

    x_start = (210 - total_width) / 2

    # ======================================
    # ORIGINAL IMAGE
    # ======================================

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_orig:

        cv2.imwrite(

            tmp_orig.name,

            cv2.cvtColor(
                original_image,
                cv2.COLOR_BGR2RGB
            )

        )

        pdf.image(

            tmp_orig.name,

            x=x_start,

            y=y_position + 5,

            w=w_img

        )

    # ======================================
    # PREPROCESSED IMAGE
    # ======================================

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_pre:

        cv2.imwrite(

            tmp_pre.name,

            preprocessed_image

        )

        pdf.image(

            tmp_pre.name,

            x=x_start + w_img + spacing,

            y=y_position + 5,

            w=w_img

        )

    # ======================================
    # SEGMENTED IMAGE
    # ======================================

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_seg:

        cv2.imwrite(

            tmp_seg.name,

            cv2.cvtColor(
                overlay_image,
                cv2.COLOR_RGB2BGR
            )

        )

        pdf.image(

            tmp_seg.name,

            x=x_start + (2 * (w_img + spacing)),

            y=y_position + 5,

            w=w_img

        )

    # ======================================
    # IMAGE LABELS
    # ======================================

    pdf.set_y(y_position + 62)

    pdf.set_font("Times", 'B', 10)

    pdf.set_x(x_start)

    pdf.cell(

        w_img,

        6,

        "Original",

        align='C'

    )

    pdf.set_x(x_start + w_img + spacing)

    pdf.cell(

        w_img,

        6,

        "Preprocessed",

        align='C'

    )

    pdf.set_x(x_start + (2 * (w_img + spacing)))

    pdf.cell(

        w_img,

        6,

        "Segmented",

        align='C',

        ln=True

    )

    pdf.ln(18)

    # ======================================
    # DIAGNOSTIC FINDINGS
    # ======================================

    pdf.set_font("Times", 'B', 16)

    pdf.set_text_color(13, 148, 136)

    pdf.cell(

        200,

        10,

        "DIAGNOSTIC FINDINGS",

        ln=True

    )

    pdf.set_text_color(15, 23, 42)

    pdf.set_font("Times", 'B', 11)

    pdf.set_fill_color(241, 245, 249)

    pdf.cell(50, 10, "Structure", 1, 0, 'C', fill=True)

    pdf.cell(100, 10, "Findings", 1, 0, 'C', fill=True)

    pdf.cell(40, 10, "AI Certainty", 1, 1, 'C', fill=True)

    pdf.set_font("Times", '', 11)

    for class_id, count in region_counts.items():

        if count > 0 and class_id != 1:

            structure = class_names[class_id]

            findings = f"Detected {count} distinct region(s)."

            pdf.cell(50, 10, structure, 1, 0, 'C')

            pdf.cell(100, 10, findings, 1, 0, 'L')

            pdf.cell(40, 10, f"{conf_score}%", 1, 1, 'C')

    # ======================================
    # FOOTER
    # ======================================

    footer_y = 268

    try:

        if os.path.exists(LOGO_2_PATH):

            pdf.image(

                LOGO_2_PATH,

                x=10,

                y=footer_y - 2,

                w=28

            )

    except Exception as e:

        print(e)

    pdf.set_xy(45, footer_y)

    pdf.set_font("Times", 'B', 10)

    pdf.cell(

        150,

        5,

        f"Company Phone: {comp_phone} | Company Email: {comp_email}",

        ln=True,

        align='L'

    )

    pdf.set_xy(45, footer_y + 6)

    pdf.set_font("Times", 'I', 8)

    pdf.set_text_color(100, 116, 139)

    disclaimer = (

        "DISCLAIMER: This report is generated by Artificial Intelligence (AI) "

        "and is intended for informational purposes only. "

        "It does not replace professional medical advice."

    )

    pdf.multi_cell(

        145,

        4,

        disclaimer,

        align='L'

    )

    # ======================================
    # SAVE PDF
    # ======================================

    pdf.output("Dental_Report.pdf")

    return True
import {

    useState,

    useEffect

} from "react"

import {

    useParams,

    useNavigate,

    Link

} from "react-router-dom"

import Navbar from "../components/Navbar"

import Footer from "../components/Footer"

import {

    getSavedReports,

    deleteReport

} from "../services/aiService"

// ==========================================
// REPORT PAGE
// ==========================================

export default function Report() {

    const { id } =
        useParams()

    const navigate =
        useNavigate()

    const [report, setReport] =
        useState(null)

    const [reports, setReports] =
        useState([])

    const [notFound, setNotFound] =
        useState(false)

    // ======================================
    // LOAD REPORTS
    // ======================================

    useEffect(() => {

        const allReports =
            getSavedReports()

        setReports(allReports)

        // ==============================
        // SINGLE REPORT
        // ==============================

        if (id) {

            const foundReport =

                allReports.find(

                    report =>

                        String(report.id) === String(id)
                )

            if (foundReport) {

                setReport(
                    foundReport
                )
            }

            else {

                setNotFound(true)
            }
        }

        // ==============================
        // DEFAULT REPORT
        // ==============================

        else if (
            allReports.length > 0
        ) {

            setReport(
                allReports[0]
            )
        }

    }, [id])

    // ======================================
    // NOT FOUND
    // ======================================

    if (notFound) {

        return (

            <>

                <Navbar solid />

                <div style={centerPage}>

                    <h1>

                        Report Not Found

                    </h1>

                    <Link
                        to="/check"
                        style={buttonStyle}
                    >

                        Start New Analysis

                    </Link>

                </div>

            </>
        )
    }

    // ======================================
    // NO REPORTS
    // ======================================

    if (
        !report &&
        reports.length === 0
    ) {

        return (

            <>

                <Navbar solid />

                <div style={centerPage}>

                    <h1>

                        No Reports Yet

                    </h1>

                    <Link
                        to="/check"
                        style={buttonStyle}
                    >

                        Upload Dental X-Ray

                    </Link>

                </div>

            </>
        )
    }

    const r =
        report || reports[0]

    if (!r) return null

    // ======================================
    // DELETE REPORT
    // ======================================

    const handleDelete = () => {

        deleteReport(r.id)

        navigate("/dashboard")
    }

    return (

        <>

            <Navbar solid />

            <div style={pageStyle}>

                <div style={containerStyle}>

                    {/* ================= */}
                    {/* HEADER */}
                    {/* ================= */}

                    <div style={headerStyle}>

                        <div>

                            <h1 style={titleStyle}>

                                Dental AI Report

                            </h1>

                            <p style={subTitle}>

                                Report ID:
                                {" "}
                                {r.serialNumber || r.id}

                            </p>

                        </div>

                        <div style={buttonGroup}>

                            <button

                                onClick={() =>

                                    window.open(
                                        "http://localhost:8000/download-report"
                                    )

                                }

                                style={buttonStyle}
                            >

                                Download PDF

                            </button>

                            <button

                                onClick={handleDelete}

                                style={deleteButton}
                            >

                                Delete Report

                            </button>

                        </div>

                    </div>

                    {/* ================= */}
                    {/* MAIN GRID */}
                    {/* ================= */}

                    <div style={mainGrid}>

                        {/* ================= */}
                        {/* SIDEBAR */}
                        {/* ================= */}

                        <div style={sidebarStyle}>

                            <h2 style={sidebarTitle}>

                                Previous Reports

                            </h2>

                            {

                                reports.map(

                                    report => (

                                        <div

                                            key={report.id}

                                            onClick={() =>

                                                navigate(
                                                    `/report/${report.id}`
                                                )

                                            }

                                            style={{

                                                ...reportItem,

                                                background:

                                                    String(r.id) ===
                                                    String(report.id)

                                                        ?

                                                        "#0f172a"

                                                        :

                                                        "transparent",

                                                border:

                                                    String(r.id) ===
                                                    String(report.id)

                                                        ?

                                                        "1px solid #38bdf8"

                                                        :

                                                        "1px solid transparent"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    color:
                                                        "#38bdf8",

                                                    fontSize:
                                                        "15px"
                                                }}
                                            >

                                                {

                                                    report.patientName ||
                                                    "Unknown Patient"
                                                }

                                            </h3>

                                            <p
                                                style={{
                                                    color:
                                                        "#94a3b8",

                                                    fontSize:
                                                        "12px",

                                                    marginTop:
                                                        "4px"
                                                }}
                                            >

                                                {

                                                    report.serialNumber ||
                                                    report.id
                                                }

                                            </p>

                                        </div>
                                    )
                                )
                            }

                        </div>

                        {/* ================= */}
                        {/* CONTENT */}
                        {/* ================= */}

                        <div>

                            {/* ================= */}
                            {/* PATIENT */}
                            {/* ================= */}

                            <Section
                                title="Patient Information"
                            >

                                <InfoGrid>

                                    <Info
                                        label="Patient Name"
                                        value={r.patientName}
                                    />

                                    <Info
                                        label="Age"
                                        value={r.patientAge}
                                    />

                                    <Info
                                        label="Phone"
                                        value={r.patientPhone}
                                    />

                                    <Info
                                        label="Gender"
                                        value={r.patientGender}
                                    />

                                </InfoGrid>

                                <div
                                    style={{
                                        marginTop:
                                            "20px"
                                    }}
                                >

                                    <Info
                                        label="Chief Complaint"
                                        value={r.patientIssue}
                                    />

                                </div>

                            </Section>

                            {/* ================= */}
                            {/* IMAGES */}
                            {/* ================= */}

                            <Section
                                title="AI Segmentation Results"
                            >

                                {

                                    r.original &&

                                    r.preprocessed &&

                                    r.segmented && (

                                        <div
                                            style={imageGrid}
                                        >

                                            <ImageCard
                                                title="Original Image"
                                                image={r.original}
                                            />

                                            <ImageCard
                                                title="Preprocessed Image"
                                                image={r.preprocessed}
                                            />

                                            <ImageCard
                                                title="Segmented Overlay"
                                                image={r.segmented}
                                            />

                                        </div>
                                    )
                                }

                            </Section>

                            {/* ================= */}
                            {/* STATISTICS */}
                            {/* ================= */}

                            <Section
                                title="Image Statistics"
                            >

                                <InfoGrid>

                                    <Info
                                        label="Brightness"
                                        value={
                                            r.statistics?.brightness
                                        }
                                    />

                                    <Info
                                        label="Contrast"
                                        value={
                                            r.statistics?.contrast
                                        }
                                    />

                                    <Info
                                        label="Sharpness"
                                        value={
                                            r.statistics?.sharpness
                                        }
                                    />

                                </InfoGrid>

                            </Section>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </>
    )
}

// ==========================================
// SECTION
// ==========================================

function Section({

    title,

    children

}) {

    return (

        <div style={sectionStyle}>

            <h2 style={sectionTitle}>

                {title}

            </h2>

            {children}

        </div>
    )
}

// ==========================================
// INFO GRID
// ==========================================

function InfoGrid({

    children

}) {

    return (

        <div style={infoGridStyle}>

            {children}

        </div>
    )
}

// ==========================================
// INFO
// ==========================================

function Info({

    label,

    value

}) {

    return (

        <div>

            <p style={infoLabel}>

                {label}

            </p>

            <h3>

                {value || "N/A"}

            </h3>

        </div>
    )
}

// ==========================================
// IMAGE CARD
// ==========================================

function ImageCard({

    title,

    image

}) {

    return (

        <div>

            <h3 style={imageTitle}>

                {title}

            </h3>

            <img

                src={image}

                alt={title}

                style={imageStyle}
            />

        </div>
    )
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {

    minHeight: "100vh",

    background: "#0f172a",

    color: "white",

    padding: "40px"
}

const containerStyle = {

    maxWidth: "1400px",

    margin: "auto"
}

const centerPage = {

    minHeight: "100vh",

    background: "#0f172a",

    color: "white",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "column"
}

const headerStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "15px",

    marginBottom: "30px"
}

const titleStyle = {

    color: "#38bdf8",

    fontSize: "40px"
}

const subTitle = {

    color: "#94a3b8"
}

const buttonGroup = {

    display: "flex",

    gap: "10px",

    flexWrap: "wrap"
}

const mainGrid = {

    display: "grid",

    gridTemplateColumns: "320px 1fr",

    gap: "25px"
}

const sidebarStyle = {

    background: "#1e293b",

    padding: "20px",

    borderRadius: "18px",

    height: "fit-content"
}

const sidebarTitle = {

    color: "#38bdf8",

    marginBottom: "20px"
}

const reportItem = {

    padding: "12px",

    borderRadius: "10px",

    marginBottom: "10px",

    cursor: "pointer"
}

const sectionStyle = {

    background: "#1e293b",

    padding: "25px",

    borderRadius: "18px",

    marginBottom: "25px"
}

const sectionTitle = {

    color: "#38bdf8",

    marginBottom: "20px"
}

const infoGridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",

    gap: "20px"
}

const infoLabel = {

    color: "#94a3b8",

    marginBottom: "5px"
}

const imageGrid = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit,minmax(300px,1fr))",

    gap: "20px"
}

const imageTitle = {

    color: "#38bdf8",

    marginBottom: "10px"
}

const imageStyle = {

    width: "100%",

    borderRadius: "12px"
}

const buttonStyle = {

    background: "#38bdf8",

    border: "none",

    padding: "12px 20px",

    borderRadius: "10px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    textDecoration: "none"
}

const deleteButton = {

    ...buttonStyle,

    background: "#ef4444"
}
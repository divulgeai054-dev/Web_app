import { useState } from "react"

import Navbar from "../components/Navbar"

import {

    segmentDentalImage,

    saveReport

} from "../services/aiService"

import useAuth from "../hooks/useAuth"

// ==========================================
// CHECK PAGE
// ==========================================

export default function Check() {

    const { user } = useAuth()

    // ======================================
    // STATES
    // ======================================

    const [patientName, setPatientName] =
        useState("")

    const [patientAge, setPatientAge] =
        useState("")

    const [patientPhone, setPatientPhone] =
        useState("")

    const [patientGender, setPatientGender] =
        useState("")

    const [patientIssue, setPatientIssue] =
        useState("")

    const [selectedFile, setSelectedFile] =
        useState(null)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState("")

    const [result, setResult] =
        useState(null)

    // ======================================
    // FILE CHANGE
    // ======================================

    const handleFileChange = (e) => {

        const file =
            e.target.files[0]

        if (file) {

            setSelectedFile(file)
        }
    }

    // ======================================
    // ANALYSIS
    // ======================================

    const handleAnalysis = async () => {

        setError("")

        if (

            !patientName ||

            !patientAge ||

            !patientPhone ||

            !patientGender ||

            !patientIssue

        ) {

            setError(
                "Please fill all patient information."
            )

            return
        }

        if (!selectedFile) {

            setError(
                "Please upload dental X-Ray."
            )

            return
        }

        try {

            setLoading(true)

            const patientData = {

                patientName,

                patientAge,

                patientPhone,

                patientGender,

                patientIssue,

                doctorName:

                    user?.name ||

                    "Doctor",

                doctorEmail:

                    user?.email ||

                    "Not Available",

                hospitalName:

                    user?.hospitalName ||

                    user?.clinic ||

                    "Dental Hospital",

                hospitalPhone:

                    user?.hospitalPhone ||

                    user?.phone ||

                    "Not Available",

                hospitalEmail:

                    user?.hospitalEmail ||

                    user?.email ||

                    "Not Available"
            }

            // ==============================
            // API CALL
            // ==============================

            const response = await segmentDentalImage(

                selectedFile,

                patientData
            )

            console.log(response)

            if (

                !response ||

                !response.original_image ||

                !response.preprocessed_image ||

                !response.segmentation_image

            ) {

                throw new Error(
                    "Invalid backend response."
                )
            }

            // ==============================
            // SET RESULT
            // ==============================

            setResult(response)

            // ==============================
            // SAVE REPORT
            // ==============================

            await saveReport({

                id:
                    Date.now(),

                serialNumber:
                    `DENT-${Date.now()}`,

                patientName,

                patientAge,

                patientPhone,

                patientGender,

                patientIssue,

                doctorName:

                    user?.name ||

                    "Doctor",

                doctorEmail:

                    user?.email ||

                    "Not Available",

                hospitalName:

                    user?.hospitalName ||

                    user?.clinic ||

                    "Dental Hospital",

                hospitalPhone:

                    user?.hospitalPhone ||

                    user?.phone ||

                    "Not Available",

                hospitalEmail:

                    user?.hospitalEmail ||

                    user?.email ||

                    "Not Available",

                date:
                    new Date().toLocaleString(),

                findings:
                    response.findings,

                statistics:
                    response.statistics,

                original:
                    `data:image/png;base64,${response.original_image}`,

                preprocessed:
                    `data:image/png;base64,${response.preprocessed_image}`,

                segmented:
                    `data:image/png;base64,${response.segmentation_image}`
            })
        }

        catch (err) {

            console.log(err)

            setError(

                err?.message ||

                "AI analysis failed."
            )
        }

        finally {

            setLoading(false)
        }
    }

    return (

        <>

            <Navbar solid />

            <div style={pageStyle}>

                <div style={containerStyle}>

                    {/* HEADER */}

                    <div style={headerStyle}>

                        <h1 style={mainTitle}>

                            Dental AI Segmentation

                        </h1>

                        <p style={subTitle}>

                            AI-powered dental analysis system

                        </p>

                    </div>

                    {/* PATIENT FORM */}

                    <div style={cardStyle}>

                        <h2 style={sectionTitle}>

                            Patient Information

                        </h2>

                        <div style={gridStyle}>

                            <input
                                type="text"
                                placeholder="Patient Name"
                                value={patientName}
                                onChange={(e)=>

                                    setPatientName(
                                        e.target.value
                                    )

                                }
                                style={inputStyle}
                            />

                            <input
                                type="number"
                                placeholder="Age"
                                value={patientAge}
                                onChange={(e)=>

                                    setPatientAge(
                                        e.target.value
                                    )

                                }
                                style={inputStyle}
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={patientPhone}
                                onChange={(e)=>

                                    setPatientPhone(
                                        e.target.value
                                    )

                                }
                                style={inputStyle}
                            />

                            <select
                                value={patientGender}
                                onChange={(e)=>

                                    setPatientGender(
                                        e.target.value
                                    )

                                }
                                style={inputStyle}
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                            </select>

                        </div>

                        <textarea
                            placeholder="Chief Complaint / Dental Issues"
                            value={patientIssue}
                            onChange={(e)=>

                                setPatientIssue(
                                    e.target.value
                                )

                            }
                            style={textareaStyle}
                        />

                    </div>

                    {/* FILE UPLOAD */}

                    <div style={cardStyle}>

                        <h2 style={sectionTitle}>

                            Upload Dental X-Ray

                        </h2>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {

                            selectedFile && (

                                <p style={selectedText}>

                                    Selected:
                                    {" "}
                                    {selectedFile.name}

                                </p>
                            )
                        }

                        <button
                            onClick={handleAnalysis}
                            disabled={loading}
                            style={buttonStyle}
                        >

                            {

                                loading

                                    ? "Analyzing..."

                                    : "Start AI Analysis"
                            }

                        </button>

                        {

                            error && (

                                <p style={errorStyle}>

                                    {error}

                                </p>
                            )
                        }

                    </div>

                    {/* RESULTS */}

                    {

                        result && (

                            <div style={cardStyle}>

                                <div style={resultHeader}>

                                    <h2 style={resultTitle}>

                                        AI Segmentation Results

                                    </h2>

                                    {/* LEGEND */}

                                    <div style={legendContainer}>

                                        <LegendItem
                                            color="rgb(255,220,255)"
                                            label="Bone Level"
                                        />

                                        <LegendItem
                                            color="rgb(170,170,70)"
                                            label="Decayed Teeth"
                                        />

                                        <LegendItem
                                            color="rgb(120,255,120)"
                                            label="Healthy Teeth"
                                        />

                                        <LegendItem
                                            color="rgb(120,220,255)"
                                            label="Implant Teeth"
                                        />

                                        <LegendItem
                                            color="rgb(255,180,255)"
                                            label="Restored Teeth"
                                        />

                                    </div>

                                </div>

                                {/* IMAGES */}

                                <div style={resultGrid}>

                                    <ImageCard
                                        title="Original Image"
                                        image={

                                            result?.original_image

                                                ?

                                                `data:image/png;base64,${result.original_image}`

                                                :

                                                ""
                                        }
                                    />

                                    <ImageCard
                                        title="Preprocessed Image"
                                        image={

                                            result?.preprocessed_image

                                                ?

                                                `data:image/png;base64,${result.preprocessed_image}`

                                                :

                                                ""
                                        }
                                    />

                                    <ImageCard
                                        title="Segmented Overlay"
                                        image={

                                            result?.segmentation_image

                                                ?

                                                `data:image/png;base64,${result.segmentation_image}`

                                                :

                                                ""
                                        }

                                        isOverlay={true}
                                    />

                                </div>

                                <button

                                    onClick={() =>

                                        window.open(
                                            "http://localhost:8000/download-report"
                                        )

                                    }

                                    style={buttonStyle}
                                >

                                    Download PDF Report

                                </button>

                            </div>
                        )
                    }

                </div>

            </div>

        </>
    )
}

// ==========================================
// IMAGE CARD
// ==========================================

function ImageCard({

    title,

    image,

    isOverlay = false

}) {

    return (

        <div style={imageCardStyle}>

            <h3 style={imageTitle}>

                {title}

            </h3>

            {

                image && (

                    <img

                        src={image}

                        alt={title}

                        style={{

                            ...imageStyle,

                            filter:

                                isOverlay

                                    ?

                                    "hue-rotate(140deg)"

                                    :

                                    "none"
                        }}
                    />
                )
            }

        </div>
    )
}

// ==========================================
// LEGEND ITEM
// ==========================================

function LegendItem({

    color,

    label

}) {

    return (

        <div style={legendItemStyle}>

            <div
                style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "4px",
                    background: color
                }}
            />

            <span style={legendText}>

                {label}

            </span>

        </div>
    )
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {

    minHeight: "100vh",

    background:
        "linear-gradient(to bottom,#0f172a,#020617)",

    padding: "40px",

    color: "white"
}

const containerStyle = {

    maxWidth: "1450px",

    margin: "auto"
}

const headerStyle = {

    textAlign: "center",

    marginBottom: "40px"
}

const mainTitle = {

    fontSize: "42px",

    color: "#38bdf8"
}

const subTitle = {

    color: "#cbd5e1"
}

const cardStyle = {

    background:
        "linear-gradient(145deg,#1e293b,#0f172a)",

    padding: "30px",

    borderRadius: "24px",

    marginBottom: "30px",

    border:
        "1px solid rgba(56,189,248,0.15)"
}

const sectionTitle = {

    color: "#38bdf8",

    marginBottom: "25px"
}

const gridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",

    gap: "20px"
}

const resultGrid = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit,minmax(320px,1fr))",

    gap: "20px",

    marginTop: "25px"
}

const inputStyle = {

    width: "100%",

    padding: "14px",

    borderRadius: "12px",

    border:
        "1px solid #334155",

    background: "#0f172a",

    color: "white",

    outline: "none"
}

const textareaStyle = {

    ...inputStyle,

    marginTop: "20px",

    minHeight: "120px"
}

const buttonStyle = {

    marginTop: "25px",

    background: "#38bdf8",

    border: "none",

    padding: "14px 24px",

    borderRadius: "12px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "15px"
}

const errorStyle = {

    color: "#ef4444",

    marginTop: "20px"
}

const selectedText = {

    marginTop: "15px",

    color: "#22c55e"
}

const resultHeader = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px"
}

const resultTitle = {

    color: "#38bdf8",

    fontSize: "28px"
}

const legendContainer = {

    display: "flex",

    flexWrap: "wrap",

    gap: "12px"
}

const legendItemStyle = {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background: "#0f172a",

    padding: "10px 14px",

    borderRadius: "10px"
}

const legendText = {

    color: "white",

    fontSize: "14px"
}

const imageCardStyle = {

    background: "#0f172a",

    padding: "20px",

    borderRadius: "18px"
}

const imageTitle = {

    color: "#38bdf8",

    marginBottom: "15px"
}

const imageStyle = {

    width: "100%",

    borderRadius: "12px"
}
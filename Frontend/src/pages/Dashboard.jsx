import { useEffect, useState } from "react"

import Navbar from "../components/Navbar"

import {

    getSavedReports,

    deleteReport

} from "../services/aiService"

export default function Dashboard() {

    // ======================================
    // STATES
    // ======================================

    const [reports, setReports] =
        useState([])

    // ======================================
    // LOAD REPORTS
    // ======================================

    useEffect(() => {

        const savedReports =
            getSavedReports()

        setReports(savedReports)

    }, [])

    // ======================================
    // DELETE REPORT
    // ======================================

    const handleDelete = (id) => {

        deleteReport(id)

        const updatedReports =
            getSavedReports()

        setReports(updatedReports)
    }

    // ======================================
    // TOTAL REPORTS
    // ======================================

    const totalReports =
        reports.length

    return (

        <>

            <Navbar solid />

            <div
                style={{
                    minHeight: "100vh",

                    background:
                        "linear-gradient(to bottom,#0f172a,#020617)",

                    padding: "40px",

                    color: "white"
                }}
            >

                <div
                    style={{
                        maxWidth: "1500px",

                        margin: "auto"
                    }}
                >

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div
                        style={{
                            marginBottom: "40px"
                        }}
                    >

                        <h1
                            style={{
                                fontSize: "42px",

                                fontWeight: "bold",

                                color: "#38bdf8",

                                marginBottom: "10px"
                            }}
                        >

                            AI Dashboard

                        </h1>

                        <p
                            style={{
                                color: "#cbd5e1",

                                fontSize: "18px"
                            }}
                        >

                            Dental AI Segmentation Reports

                        </p>

                    </div>

                    {/* ================================= */}
                    {/* ANALYTICS */}
                    {/* ================================= */}

                    <div
                        style={{
                            display: "grid",

                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(250px,1fr))",

                            gap: "25px",

                            marginBottom: "40px"
                        }}
                    >

                        {/* TOTAL REPORTS */}

                        <div style={analyticsCard}>

                            <h2 style={analyticsNumber}>

                                {totalReports}

                            </h2>

                            <p style={analyticsLabel}>

                                Total Reports

                            </p>

                        </div>

                        {/* AI STATUS */}

                        <div style={analyticsCard}>

                            <h2 style={analyticsNumber}>

                                Active

                            </h2>

                            <p style={analyticsLabel}>

                                AI System Status

                            </p>

                        </div>

                        {/* SEGMENTATION */}

                        <div style={analyticsCard}>

                            <h2 style={analyticsNumber}>

                                5

                            </h2>

                            <p style={analyticsLabel}>

                                Segmentation Classes

                            </p>

                        </div>

                    </div>

                    {/* ================================= */}
                    {/* REPORTS */}
                    {/* ================================= */}

                    {

                        reports.length === 0

                            ? (

                                <div style={emptyCard}>

                                    <h2
                                        style={{
                                            color: "#38bdf8",

                                            marginBottom: "10px"
                                        }}
                                    >

                                        No Reports Available

                                    </h2>

                                    <p
                                        style={{
                                            color: "#cbd5e1"
                                        }}
                                    >

                                        Run AI segmentation to generate reports

                                    </p>

                                </div>
                            )

                            : (

                                <div
                                    style={{
                                        display: "grid",

                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(380px,1fr))",

                                        gap: "30px"
                                    }}
                                >

                                    {

                                        reports.map((report) => (

                                            <div
                                                key={report.id}

                                                style={reportCard}
                                            >

                                                {/* ====================== */}
                                                {/* IMAGE */}
                                                {/* ====================== */}

                                                {

                                                    report.segmented && (

                                                        <img

                                                            src={report.segmented}

                                                            alt="Segmented"

                                                            style={reportImage}
                                                        />
                                                    )
                                                }

                                                {/* ====================== */}
                                                {/* CONTENT */}
                                                {/* ====================== */}

                                                <div
                                                    style={{
                                                        marginTop: "20px"
                                                    }}
                                                >

                                                    <h2
                                                        style={{
                                                            color: "#38bdf8",

                                                            fontSize: "26px",

                                                            marginBottom: "15px"
                                                        }}
                                                    >

                                                        {report.patientName}

                                                    </h2>

                                                    <div style={infoBox}>

                                                        <p style={textStyle}>

                                                            <strong>

                                                                Report ID:

                                                            </strong>

                                                            {" "}

                                                            {report.serialNumber}

                                                        </p>

                                                        <p style={textStyle}>

                                                            <strong>

                                                                Doctor:

                                                            </strong>

                                                            {" "}

                                                            {report.doctorName}

                                                        </p>

                                                        <p style={textStyle}>

                                                            <strong>

                                                                Hospital:

                                                            </strong>

                                                            {" "}

                                                            {report.hospitalName}

                                                        </p>

                                                        <p style={textStyle}>

                                                            <strong>

                                                                Date:

                                                            </strong>

                                                            {" "}

                                                            {report.date}

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ====================== */}
                                                {/* BUTTONS */}
                                                {/* ====================== */}

                                                <div
                                                    style={{
                                                        display: "flex",

                                                        gap: "15px",

                                                        marginTop: "25px",

                                                        flexWrap: "wrap"
                                                    }}
                                                >

                                                    <button

                                                        onClick={() =>

                                                            window.open(
                                                                "http://localhost:8000/download-report"
                                                            )

                                                        }

                                                        style={downloadButton}
                                                    >

                                                        Download PDF

                                                    </button>

                                                    <button

                                                        onClick={() =>

                                                            handleDelete(
                                                                report.id
                                                            )

                                                        }

                                                        style={deleteButton}
                                                    >

                                                        Delete Report

                                                    </button>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                    }

                </div>

            </div>

        </>
    )
}

// ==========================================
// STYLES
// ==========================================

const analyticsCard = {

    background:
        "linear-gradient(145deg,#1e293b,#0f172a)",

    padding: "30px",

    borderRadius: "24px",

    border:
        "1px solid rgba(56,189,248,0.2)",

    boxShadow:
        "0 10px 30px rgba(0,0,0,0.35)"
}

const analyticsNumber = {

    fontSize: "42px",

    fontWeight: "bold",

    color: "#38bdf8"
}

const analyticsLabel = {

    color: "#cbd5e1",

    marginTop: "10px",

    fontSize: "16px"
}

const emptyCard = {

    background:
        "linear-gradient(145deg,#1e293b,#0f172a)",

    padding: "60px",

    borderRadius: "24px",

    textAlign: "center",

    border:
        "1px solid rgba(56,189,248,0.2)"
}

const reportCard = {

    background:
        "linear-gradient(145deg,#1e293b,#0f172a)",

    padding: "24px",

    borderRadius: "24px",

    border:
        "1px solid rgba(56,189,248,0.15)",

    boxShadow:
        "0 10px 30px rgba(0,0,0,0.4)",

    transition: "0.3s"
}

const reportImage = {

    width: "100%",

    height: "280px",

    objectFit: "cover",

    borderRadius: "18px",

    border:
        "1px solid rgba(255,255,255,0.1)"
}

const infoBox = {

    background: "#0f172a",

    padding: "18px",

    borderRadius: "16px"
}

const textStyle = {

    color: "#cbd5e1",

    marginBottom: "10px",

    lineHeight: "1.6"
}

const downloadButton = {

    background: "#38bdf8",

    border: "none",

    padding: "14px 20px",

    borderRadius: "12px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "14px"
}

const deleteButton = {

    background: "#ef4444",

    border: "none",

    padding: "14px 20px",

    borderRadius: "12px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "14px"
}
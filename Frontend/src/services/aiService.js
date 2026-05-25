// ==========================================
// API URL
// ==========================================

const API_URL =
    "http://localhost:8000"

// ==========================================
// SEGMENT DENTAL IMAGE
// ==========================================

export const segmentDentalImage = async (

    file,

    patientData

) => {

    try {

        const formData =
            new FormData()

        // ==============================
        // FILE
        // ==============================

        formData.append(
            "file",
            file
        )

        // ==============================
        // PATIENT DATA
        // ==============================

        Object.keys(patientData).forEach(

            key => {

                formData.append(

                    key,

                    patientData[key]
                )
            }
        )

        // ==============================
        // API CALL
        // ==============================

        const response = await fetch(

            `${API_URL}/predict`,

            {

                method: "POST",

                body: formData
            }
        )

        if (!response.ok) {

            throw new Error(
                "Prediction failed"
            )
        }

        const data =
            await response.json()

        return data
    }

    catch (error) {

        console.log(error)

        throw error
    }
}

// ==========================================
// GET SAVED REPORTS
// ==========================================

export const getSavedReports = () => {

    const reports = localStorage.getItem(

        "dental_reports"
    )

    return reports

        ? JSON.parse(reports)

        : []
}

// ==========================================
// SAVE REPORT
// ==========================================

export const saveReport = (report) => {

    const existingReports =
        getSavedReports()

    // ==============================
    // ADD NEW REPORT
    // ==============================

    existingReports.unshift(report)

    localStorage.setItem(

        "dental_reports",

        JSON.stringify(existingReports)
    )
}

// ==========================================
// DELETE REPORT
// ==========================================

export const deleteReport = (id) => {

    const existingReports =
        getSavedReports()

    // ==============================
    // DELETE ONLY MATCHED REPORT
    // ==============================

    const updatedReports =

        existingReports.filter(

            report =>

                String(report.id) !==
                String(id)
        )

    // ==============================
    // SAVE UPDATED REPORTS
    // ==============================

    localStorage.setItem(

        "dental_reports",

        JSON.stringify(updatedReports)
    )

    return updatedReports
}
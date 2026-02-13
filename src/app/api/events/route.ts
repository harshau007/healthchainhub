// --- Mock Data Generators (Ported from healthchainhubmockdata/main.ts) ---

const presetUUIDs = [
    "67dfc98c-62a0-8005-9db2-47133e16903d",
    "83a7f3d1-77f2-4a4f-9e4b-df3a5a4b8c70",
    "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "abcdef12-3456-7890-abcd-ef1234567890",
    "09876543-21fe-dcba-0987-654321fedcba",
];

const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const imagingTypes = ["X-Ray", "MRI", "CT Scan"];

const imagingFindings: Record<string, string[]> = {
    "X-Ray": [
        "No evidence of acute fracture or dislocation.",
        "Mild bilateral apical pleural thickening, suggestive of old scar.",
        "Cardiac silhouette within normal limits.",
        "Lungs are clear.",
        "No pleural effusion or pneumothorax.",
    ],
    MRI: [
        "Subtle T2 hyperintense lesion in the right frontal lobe measuring 1.2 cm.",
        "No surrounding vasogenic edema.",
        "Ventricular size stable.",
        "No midline shift.",
        "No abnormal contrast enhancement.",
    ],
    "CT Scan": [
        "Small 4 mm non‐calcified pulmonary nodule in the right lower lobe.",
        "Mild mucosal thickening in the maxillary sinuses.",
        "No evidence of intracranial hemorrhage or mass effect.",
        "Bones demonstrate normal density, no acute fracture.",
        "Vessels are unremarkable.",
    ],
};

const healthSummaries = [
    "All vitals are stable.",
    "Slightly elevated blood pressure.",
    "Requires further monitoring.",
    "Minor anomalies detected.",
    "Patient in excellent condition.",
];

const appointmentHistories = [
    "2025-01-15",
    "2025-02-10",
    "2025-03-01",
    "2025-03-15",
];

function generatePatientData(id: number) {
    const name = names[id % names.length];
    const uid = presetUUIDs[id % presetUUIDs.length];
    const lastImagingType =
        imagingTypes[Math.floor(Math.random() * imagingTypes.length)];
    return {
        id: uid,
        name,
        vitalSigns: {
            heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            temperature: Number((Math.random() * (40 - 36) + 36).toFixed(1)),
            bloodPressure: `${Math.floor(Math.random() * (130 - 110 + 1)) + 110}/${Math.floor(Math.random() * (90 - 70 + 1)) + 70
                }`,
            respiratoryRate: Math.floor(Math.random() * (24 - 12 + 1)) + 12,
            oxygenSaturation: Math.floor(Math.random() * (100 - 90 + 1)) + 90,
        },
        EHR: {
            demographics: {
                age: Math.floor(Math.random() * (90 - 20 + 1)) + 20,
                gender: Math.random() > 0.5 ? "Male" : "Female",
                address: `${Math.floor(Math.random() * 1000)} Main St, City, Country`,
            },
            medicalHistory: ["Hypertension", "Diabetes"],
            allergies: ["Penicillin"],
            medications: ["Medication A", "Medication B"],
            labResults: {
                bloodSugar: Number((Math.random() * (140 - 70) + 70).toFixed(1)),
                cholesterol: Number((Math.random() * (240 - 150) + 150).toFixed(1)),
                hemoglobin: Number((Math.random() * (17 - 12) + 12).toFixed(1)),
                whiteBloodCellCount:
                    Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000,
            },
        },
        HMS: {
            appointmentStatus: Math.random() > 0.5 ? "Scheduled" : "Completed",
            appointmentHistory: appointmentHistories,
            bedAssigned: Math.random() > 0.5,
            roomNumber: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
            billingStatus: Math.random() > 0.5 ? "Paid" : "Pending",
            admissionDate: new Date(
                Date.now() - Math.floor(Math.random() * 1000000000)
            ).toISOString(),
            dischargeDate:
                Math.random() > 0.7
                    ? new Date(
                        Date.now() - Math.floor(Math.random() * 500000000)
                    ).toISOString()
                    : undefined,
        },
        imaging: {
            lastImagingType: lastImagingType,
            imagingDate: new Date(
                Date.now() - Math.floor(Math.random() * 1000000000)
            ).toISOString(),
            findings: imagingFindings[lastImagingType] || ["No findings available."],
        },
        patientPortal: {
            upcomingAppointments: ["2025-04-20", "2025-05-10"],
            messages: ["Your test results are available.", "Appointment reminder."],
            recentVisits: ["2025-03-15", "2025-02-28"],
            healthSummary:
                healthSummaries[Math.floor(Math.random() * healthSummaries.length)],
        },
    };
}

export async function GET() {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            const sendEvent = () => {
                const patients = [];
                for (let i = 0; i < 5; i++) {
                    patients.push(generatePatientData(i));
                }

                const hospitalMetrics = {
                    bedOccupancyRate: Number((Math.random() * 100).toFixed(1)),
                    icuOccupancyRate: Number((Math.random() * 100).toFixed(1)),
                    averageWaitTime: Math.floor(Math.random() * (60 - 10 + 1)) + 10,
                    totalAppointments: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                    billingSummary: {
                        totalRevenue: Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000,
                        pendingBills: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
                    },
                    emergencyResponseTime: Number((Math.random() * (30 - 5) + 5).toFixed(1)),
                    totalPatientsAdmitted: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
                    staffToPatientRatio: Number(
                        (Math.random() * (1.0 - 0.1) + 0.1).toFixed(2)
                    ),
                };

                const data = {
                    timestamp: new Date().toISOString(),
                    patients,
                    hospitalMetrics
                };

                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Send initial data
            sendEvent();

            // Send updates every 5 seconds
            const interval = setInterval(sendEvent, 60000);

            return () => clearInterval(interval);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

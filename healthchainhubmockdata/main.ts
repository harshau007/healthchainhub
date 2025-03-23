import express, { Request, Response } from "express";

const app = express();
const port = 4000;

const presetUUIDs = [
  "67dfc98c-62a0-8005-9db2-47133e16903d",
  "83a7f3d1-77f2-4a4f-9e4b-df3a5a4b8c70",
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "abcdef12-3456-7890-abcd-ef1234567890",
  "09876543-21fe-dcba-0987-654321fedcba",
];

// Define interfaces for the simulated data structures
interface Patient {
  id: string;
  name: string;
  vitalSigns: {
    heartRate: number;
    temperature: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  EHR: {
    demographics: {
      age: number;
      gender: string;
      address: string;
    };
    medicalHistory: string[];
    allergies: string[];
    medications: string[];
    labResults: {
      bloodSugar: number;
      cholesterol: number;
      hemoglobin: number;
      whiteBloodCellCount: number;
    };
  };
  HMS: {
    appointmentStatus: string;
    appointmentHistory: string[]; // Additional historical appointment data
    bedAssigned: boolean;
    roomNumber: number;
    billingStatus: string;
    admissionDate: string;
    dischargeDate?: string;
  };
  imaging: {
    lastImagingType: string;
    imagingDate: string;
    findings: string;
  };
  patientPortal: {
    upcomingAppointments: string[];
    messages: string[];
    recentVisits: string[];
    healthSummary: string; // Quick summary of patient's overall condition
  };
}

// Helper arrays for dummy selection
const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const imagingTypes = ["X-Ray", "MRI", "CT Scan"];
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

// Function to generate simulated data for a patient with a given ID
function generatePatientData(id: number): Patient {
  const name = names[id % names.length];
  const uid = presetUUIDs[id % presetUUIDs.length];
  return {
    id: uid,
    name,
    vitalSigns: {
      heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
      temperature: Number((Math.random() * (40 - 36) + 36).toFixed(1)),
      bloodPressure: `${Math.floor(Math.random() * (130 - 110 + 1)) + 110}/${
        Math.floor(Math.random() * (90 - 70 + 1)) + 70
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
      lastImagingType:
        imagingTypes[Math.floor(Math.random() * imagingTypes.length)],
      imagingDate: new Date(
        Date.now() - Math.floor(Math.random() * 1000000000)
      ).toISOString(),
      findings: "No significant abnormalities detected",
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

// SSE endpoint to stream simulated comprehensive healthcare data for multiple patients
app.get("/events", (req: Request, res: Response) => {
  // Set headers for Server-Sent Events
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to send a simulated event containing data for multiple patients and overall hospital metrics
  const sendEvent = () => {
    const patients: Patient[] = [];
    // Simulate data for 3 patients (or adjust as needed)
    for (let i = 0; i < 5; i++) {
      patients.push(generatePatientData(i));
    }

    // Extended hospital-wide metrics covering all frontend screens
    const hospitalMetrics = {
      bedOccupancyRate: Number((Math.random() * 100).toFixed(1)), // Percentage (0-100)
      icuOccupancyRate: Number((Math.random() * 100).toFixed(1)), // ICU occupancy percentage
      averageWaitTime: Math.floor(Math.random() * (60 - 10 + 1)) + 10, // in minutes
      totalAppointments: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
      billingSummary: {
        totalRevenue: Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000,
        pendingBills: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
      },
      emergencyResponseTime: Number((Math.random() * (30 - 5) + 5).toFixed(1)), // in minutes
      totalPatientsAdmitted: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
      staffToPatientRatio: Number(
        (Math.random() * (1.0 - 0.1) + 0.1).toFixed(2)
      ), // Ratio between 0.1 and 1.0
    };

    const data = {
      timestamp: new Date().toISOString(),
      patients,
      hospitalMetrics,
    };

    // Send the data as a JSON string to the client
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send new data every 5 seconds
  const intervalId = setInterval(sendEvent, 180000);

  // Clean up the interval when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Start the SSE server
app.listen(port, () => {
  console.log(`SSE server running at http://localhost:${port}`);
});

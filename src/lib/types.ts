export interface HospitalData {
  timestamp: string;
  patients: Patient[];
  hospitalMetrics: HospitalMetrics;
}

export interface Patient {
  id: string;
  name: string;
  vitalSigns: VitalSigns;
  EHR: ElectronicHealthRecord;
  HMS: HospitalManagementSystem;
  imaging: Imaging;
  patientPortal: PatientPortal;
}

export interface VitalSigns {
  heartRate: number;
  temperature: number;
  bloodPressure: string;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface ElectronicHealthRecord {
  demographics: Demographics;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  labResults: LabResults;
}

export interface Demographics {
  age: number;
  gender: string;
  address: string;
}

export interface LabResults {
  bloodSugar: number;
  cholesterol: number;
  hemoglobin: number;
  whiteBloodCellCount: number;
}

export interface HospitalManagementSystem {
  appointmentStatus: string;
  appointmentHistory: string[];
  bedAssigned: boolean;
  roomNumber: number;
  billingStatus: string;
  admissionDate: string;
  dischargeDate?: string;
}

export interface Imaging {
  lastImagingType: string;
  imagingDate: string;
  findings: string;
}

export interface PatientPortal {
  upcomingAppointments: string[];
  messages: string[];
  recentVisits: string[];
  healthSummary: string;
}

export interface HospitalMetrics {
  bedOccupancyRate: number;
  icuOccupancyRate: number;
  averageWaitTime: number;
  totalAppointments: number;
  billingSummary: {
    totalRevenue: number;
    pendingBills: number;
  };
  emergencyResponseTime: number;
  totalPatientsAdmitted: number;
  staffToPatientRatio: number;
}

export interface Anomaly {
  id: string;
  message: string;
  description: string;
  severity: "info" | "success" | "warning" | "error";
}

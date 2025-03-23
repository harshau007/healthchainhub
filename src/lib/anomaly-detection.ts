import type { Anomaly, HospitalData, Patient } from "@/lib/types";

export function detectAnomalies(
  previousData: HospitalData,
  currentData: HospitalData
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Check hospital metrics anomalies
  checkHospitalMetricsAnomalies(previousData, currentData, anomalies);

  // Check patient vital signs anomalies
  checkPatientVitalsAnomalies(previousData, currentData, anomalies);

  return anomalies;
}

function checkHospitalMetricsAnomalies(
  previousData: HospitalData,
  currentData: HospitalData,
  anomalies: Anomaly[]
) {
  const prev = previousData.hospitalMetrics;
  const curr = currentData.hospitalMetrics;

  // Check for significant increase in bed occupancy
  if (curr.bedOccupancyRate > prev.bedOccupancyRate + 10) {
    anomalies.push({
      id: `bed-occupancy-${Date.now()}`,
      message: "Bed occupancy rate increased significantly",
      description: `Increased from ${prev.bedOccupancyRate}% to ${curr.bedOccupancyRate}%`,
      severity: "warning",
    });
  }

  // Check for significant increase in ICU occupancy
  if (curr.icuOccupancyRate > prev.icuOccupancyRate + 10) {
    anomalies.push({
      id: `icu-occupancy-${Date.now()}`,
      message: "ICU occupancy rate increased significantly",
      description: `Increased from ${prev.icuOccupancyRate}% to ${curr.icuOccupancyRate}%`,
      severity: "warning",
    });
  }

  // Check for significant increase in wait time
  if (curr.averageWaitTime > prev.averageWaitTime + 10) {
    anomalies.push({
      id: `wait-time-${Date.now()}`,
      message: "Average wait time increased significantly",
      description: `Increased from ${prev.averageWaitTime} to ${curr.averageWaitTime} minutes`,
      severity: "warning",
    });
  }

  // Check for significant increase in emergency response time
  if (curr.emergencyResponseTime > prev.emergencyResponseTime + 5) {
    anomalies.push({
      id: `emergency-response-${Date.now()}`,
      message: "Emergency response time increased",
      description: `Increased from ${prev.emergencyResponseTime} to ${curr.emergencyResponseTime} minutes`,
      severity: "error",
    });
  }
}

function checkPatientVitalsAnomalies(
  previousData: HospitalData,
  currentData: HospitalData,
  anomalies: Anomaly[]
) {
  // Create a map of previous patients by ID for easy lookup
  const prevPatientsMap = new Map<string, Patient>();
  previousData.patients.forEach((patient) => {
    prevPatientsMap.set(patient.id, patient);
  });

  // Check each current patient for vital sign anomalies
  currentData.patients.forEach((patient) => {
    const prevPatient = prevPatientsMap.get(patient.id);
    if (!prevPatient) return; // Skip if this is a new patient

    // Check heart rate
    if (
      patient.vitalSigns.heartRate > 100 &&
      prevPatient.vitalSigns.heartRate <= 100
    ) {
      anomalies.push({
        id: `heart-rate-high-${patient.id}-${Date.now()}`,
        message: `${patient.name}: Elevated heart rate`,
        description: `Heart rate increased to ${patient.vitalSigns.heartRate} bpm`,
        severity: "warning",
      });
    } else if (
      patient.vitalSigns.heartRate < 60 &&
      prevPatient.vitalSigns.heartRate >= 60
    ) {
      anomalies.push({
        id: `heart-rate-low-${patient.id}-${Date.now()}`,
        message: `${patient.name}: Low heart rate`,
        description: `Heart rate decreased to ${patient.vitalSigns.heartRate} bpm`,
        severity: "warning",
      });
    }

    // Check temperature
    if (
      patient.vitalSigns.temperature > 38 &&
      prevPatient.vitalSigns.temperature <= 38
    ) {
      anomalies.push({
        id: `fever-${patient.id}-${Date.now()}`,
        message: `${patient.name}: Fever detected`,
        description: `Temperature increased to ${patient.vitalSigns.temperature}°C`,
        severity: "warning",
      });
    }

    // Check oxygen saturation
    if (
      patient.vitalSigns.oxygenSaturation < 90 &&
      prevPatient.vitalSigns.oxygenSaturation >= 90
    ) {
      anomalies.push({
        id: `oxygen-low-${patient.id}-${Date.now()}`,
        message: `${patient.name}: Low oxygen saturation`,
        description: `O₂ saturation dropped to ${patient.vitalSigns.oxygenSaturation}%`,
        severity: "error",
      });
    }

    // Check blood pressure
    const [currentSystolic] = patient.vitalSigns.bloodPressure
      .split("/")
      .map(Number);
    const [prevSystolic] = prevPatient.vitalSigns.bloodPressure
      .split("/")
      .map(Number);

    if (currentSystolic > 140 && prevSystolic <= 140) {
      anomalies.push({
        id: `high-bp-${patient.id}-${Date.now()}`,
        message: `${patient.name}: High blood pressure`,
        description: `Blood pressure increased to ${patient.vitalSigns.bloodPressure}`,
        severity: "warning",
      });
    } else if (currentSystolic < 90 && prevSystolic >= 90) {
      anomalies.push({
        id: `low-bp-${patient.id}-${Date.now()}`,
        message: `${patient.name}: Low blood pressure`,
        description: `Blood pressure decreased to ${patient.vitalSigns.bloodPressure}`,
        severity: "warning",
      });
    }
  });
}

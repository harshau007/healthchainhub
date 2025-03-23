import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Patient } from "@/lib/types";
import { formatDate, getVitalStatusBgColor } from "@/lib/utils";
import { Activity, Heart, TreesIcon as Lungs, Thermometer } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  // Determine card accent color based on patient status
  const getCardAccentColor = () => {
    if (patient.vitalSigns.oxygenSaturation < 90)
      return "border-red-500 dark:border-red-400";
    if (
      patient.vitalSigns.heartRate > 100 ||
      patient.vitalSigns.temperature > 38
    )
      return "border-amber-500 dark:border-amber-400";
    return "border-green-500 dark:border-green-400";
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getCardAccentColor()}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{patient.name}</CardTitle>
          <Badge
            variant={patient.HMS.bedAssigned ? "default" : "outline"}
            className={
              patient.HMS.bedAssigned
                ? "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                : ""
            }
          >
            {patient.HMS.bedAssigned
              ? `Room ${patient.HMS.roomNumber}`
              : "Outpatient"}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {patient.EHR.demographics.age} yrs • {patient.EHR.demographics.gender}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-full ${getVitalStatusBgColor(
                "heartRate",
                patient.vitalSigns.heartRate
              )}`}
            >
              <Heart className={`h-3.5 w-3.5 text-white`} />
            </div>
            <span className="text-sm">{patient.vitalSigns.heartRate} bpm</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-full ${getVitalStatusBgColor(
                "temperature",
                patient.vitalSigns.temperature
              )}`}
            >
              <Thermometer className={`h-3.5 w-3.5 text-white`} />
            </div>
            <span className="text-sm">{patient.vitalSigns.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-full ${getVitalStatusBgColor(
                "bloodPressure",
                patient.vitalSigns.bloodPressure
              )}`}
            >
              <Activity className={`h-3.5 w-3.5 text-white`} />
            </div>
            <span className="text-sm">{patient.vitalSigns.bloodPressure}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-full ${getVitalStatusBgColor(
                "oxygenSaturation",
                patient.vitalSigns.oxygenSaturation
              )}`}
            >
              <Lungs className={`h-3.5 w-3.5 text-white`} />
            </div>
            <span className="text-sm">
              {patient.vitalSigns.oxygenSaturation}% O₂
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{patient.HMS.appointmentStatus}</span>
          </div>
          {patient.HMS.bedAssigned && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Admitted:</span>
              <span className="font-medium">
                {formatDate(patient.HMS.admissionDate)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

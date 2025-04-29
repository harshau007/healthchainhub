import { PatientLabResultsChart } from "@/components/patient-lab-results-chart";
import { PatientVitalsChart } from "@/components/patient-vitals-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Patient } from "@/lib/types";
import { formatDate, getVitalStatusBgColor } from "@/lib/utils";
import { Activity, Heart, TreesIcon as Lungs, Thermometer } from "lucide-react";

interface PatientDetailsProps {
  patient: Patient;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  const imagingPreviews: Record<string, string> = {
    "X-Ray": "/dummy-xray.jpg",
    MRI: "/dummy-mri.png",
    "CT Scan": "/dummy-ct.png",
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            {patient.name}
          </h1>
          <p className="text-muted-foreground">
            ID: {patient.id} • {patient.EHR.demographics.age} years •{" "}
            {patient.EHR.demographics.gender}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
          <Badge
            variant="outline"
            className="border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400"
          >
            {patient.HMS.appointmentStatus}
          </Badge>
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400"
          >
            {patient.HMS.billingStatus}
          </Badge>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div
                className={`p-3 rounded-full ${getVitalStatusBgColor(
                  "heartRate",
                  patient.vitalSigns.heartRate
                )}`}
              >
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Heart Rate
                </p>
                <p className="text-2xl font-bold">
                  {patient.vitalSigns.heartRate}
                </p>
                <p className="text-xs text-muted-foreground">bpm</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div
                className={`p-3 rounded-full ${getVitalStatusBgColor(
                  "temperature",
                  patient.vitalSigns.temperature
                )}`}
              >
                <Thermometer className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Temperature
                </p>
                <p className="text-2xl font-bold">
                  {patient.vitalSigns.temperature}
                </p>
                <p className="text-xs text-muted-foreground">°C</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div
                className={`p-3 rounded-full ${getVitalStatusBgColor(
                  "bloodPressure",
                  patient.vitalSigns.bloodPressure
                )}`}
              >
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Blood Pressure
                </p>
                <p className="text-2xl font-bold">
                  {patient.vitalSigns.bloodPressure}
                </p>
                <p className="text-xs text-muted-foreground">mmHg</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div
                className={`p-3 rounded-full ${getVitalStatusBgColor(
                  "oxygenSaturation",
                  patient.vitalSigns.oxygenSaturation
                )}`}
              >
                <Lungs className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Oxygen
                </p>
                <p className="text-2xl font-bold">
                  {patient.vitalSigns.oxygenSaturation}
                </p>
                <p className="text-xs text-muted-foreground">%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-t-4 border-t-blue-500 dark:border-t-blue-400">
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PatientVitalsChart patient={patient} />
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500 dark:border-t-green-400">
              <CardHeader>
                <CardTitle>Lab Results</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PatientLabResultsChart patient={patient} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-medium">Age:</dt>
                  <dd>{patient.EHR.demographics.age}</dd>

                  <dt className="font-medium">Gender:</dt>
                  <dd>{patient.EHR.demographics.gender}</dd>

                  <dt className="font-medium">Address:</dt>
                  <dd>{patient.EHR.demographics.address}</dd>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400">
              <CardHeader>
                <CardTitle>Hospital Status</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-medium">Status:</dt>
                  <dd>{patient.HMS.appointmentStatus}</dd>

                  <dt className="font-medium">Room:</dt>
                  <dd>
                    {patient.HMS.bedAssigned ? patient.HMS.roomNumber : "N/A"}
                  </dd>

                  <dt className="font-medium">Billing:</dt>
                  <dd>{patient.HMS.billingStatus}</dd>

                  <dt className="font-medium">Admitted:</dt>
                  <dd>{formatDate(patient.HMS.admissionDate)}</dd>

                  {patient.HMS.dischargeDate && (
                    <>
                      <dt className="font-medium">Discharged:</dt>
                      <dd>{formatDate(patient.HMS.dischargeDate)}</dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-rose-500 dark:border-l-rose-400">
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {patient.EHR.medicalHistory.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 dark:border-l-red-400">
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {patient.EHR.allergies.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-l-4 border-l-indigo-500 dark:border-l-indigo-400">
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {patient.EHR.medications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-teal-500 dark:border-t-teal-400">
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1 p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                  <dt className="text-muted-foreground">Blood Sugar</dt>
                  <dd className="text-2xl font-medium">
                    {patient.EHR.labResults.bloodSugar}
                  </dd>
                  <dd className="text-xs text-muted-foreground">mg/dL</dd>
                </div>

                <div className="space-y-1 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <dt className="text-muted-foreground">Cholesterol</dt>
                  <dd className="text-2xl font-medium">
                    {patient.EHR.labResults.cholesterol}
                  </dd>
                  <dd className="text-xs text-muted-foreground">mg/dL</dd>
                </div>

                <div className="space-y-1 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <dt className="text-muted-foreground">Hemoglobin</dt>
                  <dd className="text-2xl font-medium">
                    {patient.EHR.labResults.hemoglobin}
                  </dd>
                  <dd className="text-xs text-muted-foreground">g/dL</dd>
                </div>

                <div className="space-y-1 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <dt className="text-muted-foreground">WBC Count</dt>
                  <dd className="text-2xl font-medium">
                    {patient.EHR.labResults.whiteBloodCellCount}
                  </dd>
                  <dd className="text-xs text-muted-foreground">cells/μL</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4 mt-4">
          <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patient.HMS.appointmentHistory.map((date, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 last:border-0"
                  >
                    <span>{date}</span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    >
                      Completed
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patient.patientPortal.upcomingAppointments.map(
                  (date, index) => (
                    <li
                      key={index}
                      className="flex justify-between border-b pb-2 last:border-0"
                    >
                      <span>{date}</span>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                      >
                        Scheduled
                      </Badge>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patient.patientPortal.messages.map((message, index) => (
                  <li
                    key={index}
                    className="border-b pb-2 last:border-0 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md"
                  >
                    {message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging" className="space-y-4 mt-4">
          <Card className="border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
            <CardHeader>
              <CardTitle>Imaging Results</CardTitle>
              <CardDescription>
                Last imaging: {patient.imaging.lastImagingType} on{" "}
                {formatDate(patient.imaging.imagingDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg flex items-center justify-center border border-indigo-100 dark:border-indigo-900 overflow-hidden">
                  <img
                    src={
                      imagingPreviews[patient.imaging.lastImagingType] ||
                      "/images/dummy-generic.jpg"
                    }
                    alt={`${patient.imaging.lastImagingType} Preview`}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h4 className="font-medium mb-2">Findings</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(
                      patient.imaging.findings || ["No findings available."]
                    ).map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

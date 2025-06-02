"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Heart,
  Loader2,
  MessageSquare,
  Shield,
  Thermometer,
  TrendingUp,
  User,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

interface RecordMeta {
  dataHash: string;
  timestamp: number;
  recordType: string;
}

interface VitalSigns {
  heartRate: number;
  temperature: number;
  bloodPressure: string;
  oxygenSaturation: number;
  respiratoryRate: number;
}

interface PatientPortal {
  upcomingAppointments: string[];
  messages: string[];
  healthSummary: string;
}

interface DashboardStatus {
  message: string;
  type: "idle" | "loading" | "success" | "error" | "warning";
}

export default function PatientDashboard() {
  const { address: patientAddress, role, loggedIn } = useAuth();

  // Mock real-time data
  const [mockVitals, setMockVitals] = useState<VitalSigns>({
    heartRate: 72,
    temperature: 36.7,
    bloodPressure: "118/76",
    oxygenSaturation: 98,
    respiratoryRate: 16,
  });

  const [mockPortal, setMockPortal] = useState<PatientPortal>({
    upcomingAppointments: ["2025-06-15", "2025-07-01"],
    messages: [
      "Your latest blood test results are available.",
      "Reminder: Annual check-up scheduled for next month.",
      "Prescription refill approved by Dr. Johnson.",
    ],
    healthSummary:
      "All vitals within normal range. Keep up the good work with your exercise routine!",
  });

  // Contract setup
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // On-chain records
  const [recordCount, setRecordCount] = useState<number>(0);
  const [recentRecords, setRecentRecords] = useState<RecordMeta[]>([]);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(false);

  // Consent management
  const MOCK_DOCTORS = [
    {
      name: "Dr. Alice Johnson",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      specialty: "Cardiologist",
    },
    {
      name: "Dr. Bob Smith",
      address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      specialty: "General Practitioner",
    },
    {
      name: "LabCorp Diagnostics",
      address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
      specialty: "Lab",
    },
  ];

  const [consentList, setConsentList] = useState<typeof MOCK_DOCTORS>([]);
  const [status, setStatus] = useState<DashboardStatus>({
    message: "",
    type: "idle",
  });

  // Initialize provider, signer, contract
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setStatus({
        message: "MetaMask not detected. Please install MetaMask to continue.",
        type: "error",
      });
      return;
    }

    const initializeWallet = async () => {
      try {
        const _provider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(_provider);

        await _provider.send("eth_requestAccounts", []);
        const _signer = await _provider.getSigner();
        setSigner(_signer);

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

        // Validate contract address format
        if (!contractAddress) {
          setStatus({
            message:
              "Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.",
            type: "error",
          });
          return;
        }

        if (
          !contractAddress.startsWith("0x") ||
          contractAddress.length !== 42
        ) {
          setStatus({
            message:
              "Invalid contract address format. Must be a valid Ethereum address starting with 0x.",
            type: "error",
          });
          return;
        }

        if (!ethers.isAddress(contractAddress)) {
          setStatus({
            message:
              "Invalid contract address. Please check the NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.",
            type: "error",
          });
          return;
        }

        const _contract = new ethers.Contract(
          contractAddress,
          HealthcareAuthPlusAbi.abi,
          _signer
        );
        setContract(_contract);

        setStatus({
          message: "Dashboard loaded successfully.",
          type: "success",
        });
      } catch (err: any) {
        console.error("Wallet connection error:", err);
        setStatus({
          message: `Unable to connect wallet: ${
            err.message || "Please try again."
          }`,
          type: "error",
        });
      }
    };

    initializeWallet();
  }, []);

  // Fetch on-chain records and consent once ready
  useEffect(() => {
    if (loggedIn && role === "Patient" && contract && patientAddress) {
      loadRecentRecords();
      loadConsentList();
    }
  }, [loggedIn, role, contract, patientAddress]);

  // Simulate real-time vital signs updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMockVitals((prev) => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
        temperature: 36.5 + Math.random() * 0.5,
        oxygenSaturation: 97 + Math.floor(Math.random() * 3),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadRecentRecords = async () => {
    if (!contract || !ethers.isAddress(patientAddress!)) return;
    setLoadingRecords(true);
    try {
      const countBigInt: bigint = await contract.getRecordCount(
        patientAddress!
      );
      const count = Number(countBigInt);
      setRecordCount(count);

      const recs: RecordMeta[] = [];
      const start = Math.max(0, count - 3); // Get last 3 records
      for (let i = start; i < count; i++) {
        const [dataHash, tsBigInt, recordType] = await contract.getHealthRecord(
          patientAddress!,
          i
        );
        recs.push({
          dataHash: dataHash as string,
          timestamp: Number(tsBigInt as bigint),
          recordType: recordType as string,
        });
      }
      setRecentRecords(recs.reverse());
    } catch (e) {
      console.error("Error loading records:", e);
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadConsentList = async () => {
    if (!contract || !ethers.isAddress(patientAddress!)) return;
    const granted: typeof MOCK_DOCTORS = [];
    for (const doc of MOCK_DOCTORS) {
      try {
        const has: boolean = await contract.hasConsent(
          patientAddress!,
          doc.address
        );
        if (has) granted.push(doc);
      } catch {
        // ignore
      }
    }
    setConsentList(granted);
  };

  const handleRevoke = async (docAddr: string) => {
    if (!contract) return;
    setStatus({
      message: "Revoking consent...",
      type: "loading",
    });
    try {
      const tx = await contract.revokeConsent(docAddr);
      await tx.wait();
      setStatus({
        message: "Consent revoked successfully.",
        type: "success",
      });
      loadConsentList();
    } catch (e: any) {
      console.error("Revoke error:", e);
      setStatus({
        message: e.reason || "Error revoking consent.",
        type: "error",
      });
    }
  };

  const viewRecord = (dataHash: string) => {
    const storedCid = localStorage.getItem(`cid:${dataHash}`);
    const ipfsCid = storedCid || dataHash;
    window.open(`https://gateway.pinata.cloud/ipfs/${ipfsCid}`, "_blank");
  };

  const getRecordTypeIcon = (recordType: string) => {
    switch (recordType.toLowerCase()) {
      case "labreport":
        return <Activity className="h-4 w-4" />;
      case "imaging":
        return <Eye className="h-4 w-4" />;
      case "diagnosis":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeBadge = (recordType: string) => {
    const variants: Record<string, string> = {
      labreport:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      imaging:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      diagnosis:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      prescription:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      vitalsigns:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      treatmentplan:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };

    const className =
      variants[recordType.toLowerCase()] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";

    return (
      <Badge className={className}>
        {getRecordTypeIcon(recordType)}
        <span className="ml-1">{recordType}</span>
      </Badge>
    );
  };

  const getVitalStatus = (vital: string, value: number | string) => {
    // Simple health ranges for demo
    const ranges: Record<string, { min: number; max: number; unit: string }> = {
      heartRate: { min: 60, max: 100, unit: "bpm" },
      temperature: { min: 36.1, max: 37.2, unit: "°C" },
      oxygenSaturation: { min: 95, max: 100, unit: "%" },
      respiratoryRate: { min: 12, max: 20, unit: "bpm" },
    };

    if (vital === "bloodPressure") {
      return { status: "normal", color: "text-green-600" };
    }

    const range = ranges[vital];
    if (!range || typeof value !== "number") {
      return { status: "normal", color: "text-green-600" };
    }

    if (value < range.min || value > range.max) {
      return { status: "abnormal", color: "text-red-600" };
    }
    return { status: "normal", color: "text-green-600" };
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (status.type) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  if (!loggedIn || role !== "Patient") {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">Patient Dashboard</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Only logged-in patients can view this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Your Health Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your health records and vital signs
          </p>
        </div>
        <div className="flex items-center gap-2 outline rounded-xl">
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Patient
          </Badge>
          {patientAddress && (
            <Badge variant="secondary" className="hidden sm:flex">
              {`${patientAddress.slice(0, 6)}...${patientAddress.slice(-4)}`}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Health Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Health Records
                {recordCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {recordCount} total
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your latest medical records stored on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecords ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recordCount === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Records Yet</h3>
                  <p className="text-muted-foreground">
                    Your health records will appear here once uploaded.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRecords.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getRecordTypeBadge(rec.recordType)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(rec.timestamp * 1000).toLocaleString()}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            Hash: {rec.dataHash.slice(0, 16)}...
                          </div>
                        </div>
                        <Button
                          onClick={() => viewRecord(rec.dataHash)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {recordCount > 3 && (
                <div className="mt-4 pt-4 border-t">
                  <Link href="/records">
                    <Button variant="outline" className="w-full">
                      View All {recordCount} Records
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Portal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Patient Portal
              </CardTitle>
              <CardDescription>
                Appointments, messages, and health updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Next Appointment</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        mockPortal.upcomingAppointments[0]
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Recent Messages</h4>
                    <div className="space-y-2 mt-2">
                      {mockPortal.messages.slice(0, 2).map((msg, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-muted rounded-md text-sm"
                        >
                          {msg}
                        </div>
                      ))}
                    </div>
                    {mockPortal.messages.length > 2 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        +{mockPortal.messages.length - 2} more messages
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Health Summary</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockPortal.healthSummary}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Latest Vital Signs
              </CardTitle>
              <CardDescription>Real-time health monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        getVitalStatus("heartRate", mockVitals.heartRate).color
                      }`}
                    >
                      {mockVitals.heartRate} bpm
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        getVitalStatus("temperature", mockVitals.temperature)
                          .color
                      }`}
                    >
                      {mockVitals.temperature.toFixed(1)} °C
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Blood Pressure</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        getVitalStatus(
                          "bloodPressure",
                          mockVitals.bloodPressure
                        ).color
                      }`}
                    >
                      {mockVitals.bloodPressure}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Oxygen Saturation</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        getVitalStatus(
                          "oxygenSaturation",
                          mockVitals.oxygenSaturation
                        ).color
                      }`}
                    >
                      {mockVitals.oxygenSaturation}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Respiratory Rate</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        getVitalStatus(
                          "respiratoryRate",
                          mockVitals.respiratoryRate
                        ).color
                      }`}
                    >
                      {mockVitals.respiratoryRate} bpm
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Active Consents
              </CardTitle>
              <CardDescription>
                Doctors with access to your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {consentList.length === 0 ? (
                <div className="text-center py-4">
                  <UserX className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No active consents
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consentList.map((doc) => (
                    <div key={doc.address} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.specialty}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {`${doc.address.slice(0, 6)}...${doc.address.slice(
                              -4
                            )}`}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRevoke(doc.address)}
                          variant="destructive"
                          size="sm"
                          className="shrink-0"
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Link href="/consent">
                  <Button variant="outline" className="w-full" size="sm">
                    Manage All Consents
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/records">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Records
                </Button>
              </Link>
              <Link href="/consent">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Consent
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* {status.message && (
        <Alert variant={getStatusVariant()}>
          {getStatusIcon()}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )} */}
    </div>
  );
}

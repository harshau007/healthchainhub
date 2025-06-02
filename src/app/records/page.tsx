"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Search,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

interface RecordMeta {
  dataHash: string;
  timestamp: number;
  recordType: string;
}

interface RecordsStatus {
  message: string;
  type: "idle" | "loading" | "success" | "error" | "warning";
}

export default function RecordsPage() {
  const { address: userAddress, role, loggedIn } = useAuth();

  const [patientAddressInput, setPatientAddressInput] = useState<string>("");
  const [recordCount, setRecordCount] = useState<number>(0);
  const [records, setRecords] = useState<RecordMeta[]>([]);
  const [status, setStatus] = useState<RecordsStatus>({
    message: "",
    type: "idle",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize Ethereum provider, signer, contract
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
          message: "Wallet connected successfully.",
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

  // If Patient, auto-set patientAddressInput and fetch records
  useEffect(() => {
    if (loggedIn && role === "Patient" && userAddress && contract) {
      setPatientAddressInput(userAddress);
      fetchRecords(userAddress);
    }
  }, [loggedIn, role, userAddress, contract]);

  const fetchRecords = async (addressToFetch: string) => {
    if (!contract) {
      setStatus({
        message: "Contract not initialized.",
        type: "error",
      });
      return;
    }

    if (!ethers.isAddress(addressToFetch)) {
      setStatus({
        message: "Invalid patient address format.",
        type: "error",
      });
      setRecords([]);
      setRecordCount(0);
      return;
    }

    setIsLoading(true);

    try {
      // If doctor, verify patient granted consent
      if (role === "Doctor" && userAddress) {
        setStatus({
          message: "Checking patient consent on blockchain...",
          type: "loading",
        });

        const hasConsent: boolean = await contract.hasConsent(
          addressToFetch,
          userAddress
        );
        if (!hasConsent) {
          setStatus({
            message:
              "Cannot fetch records: Patient has not granted you consent to access their records.",
            type: "error",
          });
          setRecords([]);
          setRecordCount(0);
          setIsLoading(false);
          return;
        }
      }

      setStatus({
        message: "Fetching record count from blockchain...",
        type: "loading",
      });

      const countBigInt: bigint = await contract.getRecordCount(addressToFetch);
      const count = Number(countBigInt);
      setRecordCount(count);

      if (count === 0) {
        setRecords([]);
        setStatus({
          message: "No health records found for this address.",
          type: "warning",
        });
        setIsLoading(false);
        return;
      }

      setStatus({
        message: `Found ${count} record${
          count !== 1 ? "s" : ""
        }. Fetching details...`,
        type: "loading",
      });

      const recs: RecordMeta[] = [];
      for (let i = 0; i < count; i++) {
        const [dataHash, tsBigInt, recordType] = await contract.getHealthRecord(
          addressToFetch,
          i
        );
        recs.push({
          dataHash: dataHash as string,
          timestamp: Number(tsBigInt as bigint),
          recordType: recordType as string,
        });
      }

      setRecords(recs.reverse()); // Show newest first
      setStatus({
        message: `Successfully loaded ${count} health record${
          count !== 1 ? "s" : ""
        }.`,
        type: "success",
      });
    } catch (error: any) {
      console.error("Error fetching records:", error);
      setStatus({
        message: error.reason || "Failed to fetch records. Please try again.",
        type: "error",
      });
      setRecords([]);
      setRecordCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchClick = () => {
    if (!patientAddressInput) {
      setStatus({
        message: "Please enter a patient address.",
        type: "error",
      });
      return;
    }
    if (!ethers.isAddress(patientAddressInput)) {
      setStatus({
        message: "Invalid address format.",
        type: "error",
      });
      return;
    }
    fetchRecords(patientAddressInput);
  };

  const viewRecord = (dataHash: string) => {
    const storedCid = localStorage.getItem(`cid:${dataHash}`);
    const ipfsCid = storedCid || dataHash;
    window.open(`https://gateway.pinata.cloud/ipfs/${ipfsCid}`, "_blank");
  };

  const getRecordTypeIcon = (recordType: string) => {
    switch (recordType.toLowerCase()) {
      case "labreport":
        return <Database className="h-4 w-4" />;
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

  if (!loggedIn) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">Health Records</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to view health records.
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
          <h1 className="text-2xl font-bold md:text-3xl">Health Records</h1>
          <p className="text-muted-foreground">
            View and access blockchain-secured health records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {role}
          </Badge>
          {userAddress && (
            <Badge variant="secondary" className="hidden sm:flex">
              {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Search/Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {role === "Doctor" ? "Patient Lookup" : "Your Records"}
              </CardTitle>
              <CardDescription>
                {role === "Doctor"
                  ? "Enter a patient's address to view their records (requires consent)"
                  : "Your health records stored on the blockchain"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {role === "Doctor" && (
                <div className="space-y-2">
                  <Label htmlFor="patientAddress">Patient Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="patientAddress"
                      type="text"
                      value={patientAddressInput}
                      onChange={(e) => setPatientAddressInput(e.target.value)}
                      placeholder="0x..."
                      className="font-mono"
                    />
                    <Button onClick={handleFetchClick} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Fetch
                    </Button>
                  </div>
                </div>
              )}

              {role === "Patient" && (
                <div className="space-y-2">
                  <Label htmlFor="yourAddress">Your Address</Label>
                  <Input
                    id="yourAddress"
                    type="text"
                    value={patientAddressInput}
                    readOnly
                    className="font-mono bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Records List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Records
                {recordCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {recordCount} record{recordCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {role === "Doctor" ? "Patient's" : "Your"} health records
                secured on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-24" />
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getRecordTypeBadge(record.recordType)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.timestamp * 1000).toLocaleString()}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            Hash: {record.dataHash.slice(0, 16)}...
                          </div>
                        </div>
                        <Button
                          onClick={() => viewRecord(record.dataHash)}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on IPFS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {role === "Doctor"
                      ? "No records found for this patient address."
                      : "You haven't uploaded any health records yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Records</span>
                <Badge variant="secondary">{recordCount}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Record Types</span>
                <Badge variant="secondary">
                  {new Set(records.map((r) => r.recordType)).size}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Latest Record</span>
                <span className="text-sm text-muted-foreground">
                  {records.length > 0
                    ? new Date(records[0].timestamp * 1000).toLocaleDateString()
                    : "No records"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Blockchain immutability
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                IPFS distributed storage
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cryptographic verification
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Patient consent control
              </div>
            </CardContent>
          </Card>

          {role === "Doctor" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Access Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-2">To access patient records:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Patient must grant consent</li>
                    <li>• Valid patient address required</li>
                    <li>• Blockchain verification needed</li>
                    <li>• HIPAA compliance maintained</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {status.message && (
        <Alert variant={getStatusVariant()}>
          {getStatusIcon()}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

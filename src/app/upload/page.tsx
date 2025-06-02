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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

interface UploadStatus {
  message: string;
  type: "idle" | "loading" | "success" | "error" | "warning";
  progress?: number;
}

export default function UploadPage() {
  const { address: userAddress, role, loggedIn } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState<string>("LabReport");
  const [patientAddressInput, setPatientAddressInput] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    message: "",
    type: "idle",
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize provider, signer, contract
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setUploadStatus({
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
          setUploadStatus({
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
          setUploadStatus({
            message:
              "Invalid contract address format. Must be a valid Ethereum address starting with 0x.",
            type: "error",
          });
          return;
        }

        if (!ethers.isAddress(contractAddress)) {
          setUploadStatus({
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

        setUploadStatus({
          message: "Wallet connected successfully.",
          type: "success",
        });
      } catch (err: any) {
        console.error("Wallet connection error:", err);
        setUploadStatus({
          message: `Unable to connect wallet: ${
            err.message || "Please try again."
          }`,
          type: "error",
        });
      }
    };

    initializeWallet();
  }, []);

  // If Patient, auto-fill their own address
  useEffect(() => {
    if (loggedIn && role === "Patient" && userAddress) {
      setPatientAddressInput(userAddress);
    }
  }, [loggedIn, role, userAddress]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus({
        message: `File selected: ${selectedFile.name} (${(
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB)`,
        type: "success",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!loggedIn) {
      setUploadStatus({
        message: "You must be logged in to upload records.",
        type: "error",
      });
      return;
    }

    if (!contract || !signer) {
      setUploadStatus({
        message: "Wallet or contract not ready. Please refresh and try again.",
        type: "error",
      });
      return;
    }

    const patientAddress =
      role === "Doctor" ? patientAddressInput.trim() : userAddress || "";

    if (!ethers.isAddress(patientAddress)) {
      setUploadStatus({
        message: "Invalid patient address format.",
        type: "error",
      });
      return;
    }

    if (!file) {
      setUploadStatus({
        message: "Please select a file to upload.",
        type: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Check consent if Doctor
      if (role === "Doctor") {
        setUploadStatus({
          message: "Checking patient consent on blockchain...",
          type: "loading",
          progress: 20,
        });

        const hasConsent: boolean = await contract.hasConsent(
          patientAddress,
          userAddress
        );
        if (!hasConsent) {
          setUploadStatus({
            message:
              "Cannot upload: The patient has not granted you consent to access their records.",
            type: "error",
          });
          setIsUploading(false);
          return;
        }
      }

      // Upload to Pinata
      setUploadStatus({
        message: "Uploading file to IPFS network...",
        type: "loading",
        progress: 50,
      });

      const formData = new FormData();
      formData.append("patientAddress", patientAddress);
      formData.append("recordType", recordType);
      formData.append("file", file);

      const res = await fetch("/api/fog/add-record", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!json.success) {
        setUploadStatus({
          message: `Upload failed: ${json.error || "Unknown error occurred"}`,
          type: "error",
        });
        setIsUploading(false);
        return;
      }

      const { ipfsCid, dataHash } = json;

      setUploadStatus({
        message: `File uploaded to IPFS: ${ipfsCid}. Registering on blockchain...`,
        type: "loading",
        progress: 80,
      });

      // Register on blockchain
      const tx = await contract.addHealthRecord(
        patientAddress,
        dataHash,
        recordType,
        {
          value: ethers.parseEther("0.001"),
        }
      );

      setUploadStatus({
        message: `Transaction submitted: ${tx.hash}. Waiting for confirmation...`,
        type: "loading",
        progress: 90,
      });

      await tx.wait();

      // Store CID locally for future reference
      localStorage.setItem(`cid:${dataHash}`, ipfsCid);

      setUploadStatus({
        message: `Record successfully uploaded and registered! Transaction: ${tx.hash}`,
        type: "success",
        progress: 100,
      });

      // Reset form
      setFile(null);
      if (role === "Doctor") {
        setPatientAddressInput("");
      }
      setRecordType("LabReport");
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus({
        message: error.reason || "Failed to upload record. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus.type) {
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
    switch (uploadStatus.type) {
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
          <h1 className="text-2xl font-bold md:text-3xl">
            Upload Health Record
          </h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to upload health records.
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
            Upload Health Record
          </h1>
          <p className="text-muted-foreground">
            Securely upload and register health records on the blockchain
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Record Upload
              </CardTitle>
              <CardDescription>
                Fill in the details below to upload a new health record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {role === "Doctor" && (
                  <div className="space-y-2">
                    <Label htmlFor="patientAddress">Patient Address</Label>
                    <Input
                      id="patientAddress"
                      type="text"
                      value={patientAddressInput}
                      onChange={(e) => setPatientAddressInput(e.target.value)}
                      placeholder="0x..."
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the patient's wallet address to upload their record
                    </p>
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
                    <p className="text-xs text-muted-foreground">
                      Records will be uploaded to your address
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recordType">Record Type</Label>
                  <Select value={recordType} onValueChange={setRecordType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LabReport">Lab Report</SelectItem>
                      <SelectItem value="Imaging">Medical Imaging</SelectItem>
                      <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="Prescription">Prescription</SelectItem>
                      <SelectItem value="VitalSigns">Vital Signs</SelectItem>
                      <SelectItem value="TreatmentPlan">
                        Treatment Plan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Health Record File</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.json,.txt,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="file"
                      className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Click to select file or drag and drop
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, Images, JSON, Text documents (Max
                      10MB)
                    </p>
                    {file && (
                      <div className="mt-3 p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!file || isUploading}
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Register On-Chain
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  File Selection
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  IPFS Upload
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  Blockchain Registration
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  Confirmation
                </div>
              </div>
              {uploadStatus.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{uploadStatus.progress}%</span>
                  </div>
                  <Progress value={uploadStatus.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                End-to-end encryption
              </div>
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
                Patient consent verification
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {uploadStatus.message && (
        <Alert variant={getStatusVariant()}>
          {getStatusIcon()}
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

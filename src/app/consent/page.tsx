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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { blockchainClient } from "@/lib/blockchain/client";
import { useSimulation } from "@/components/blockchain/simulation-provider";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Shield,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ConsentStatus {
  message: string;
  type: "idle" | "loading" | "success" | "error" | "warning";
}

interface Consumer {
  name: string;
  address: string;
  type: "doctor" | "lab" | "hospital" | "specialist";
}

// Mock list of healthcare providers
const HEALTHCARE_PROVIDERS: Consumer[] = [
  {
    name: "Dr. Alice Johnson",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    type: "doctor",
  },
  {
    name: "Dr. Bob Smith",
    address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    type: "doctor",
  },
  {
    name: "LabCorp Diagnostics",
    address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    type: "lab",
  },
  {
    name: "City General Hospital",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    type: "hospital",
  },
  {
    name: "Dr. Carol Williams (Cardiologist)",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    type: "specialist",
  },
];

export default function ConsentPage() {
  const { address: patientAddress, role, loggedIn } = useAuth();
  const { sendTransaction } = useSimulation();

  const [selectedConsumer, setSelectedConsumer] = useState<string>(
    HEALTHCARE_PROVIDERS[0].address
  );
  const [status, setStatus] = useState<ConsentStatus>({
    message: "",
    type: "idle",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consentStatuses, setConsentStatuses] = useState<
    Record<string, boolean>
  >({});

  // Load consent statuses when ready
  useEffect(() => {
    const loadAllConsentStatuses = async () => {
      if (!patientAddress) return;

      try {
        const statuses: Record<string, boolean> = {};
        for (const provider of HEALTHCARE_PROVIDERS) {
          const hasConsent = await blockchainClient.hasConsent(
            patientAddress,
            provider.address
          );
          statuses[provider.address] = hasConsent;
        }
        setConsentStatuses(statuses);
      } catch (error) {
        console.error("Error loading consent statuses:", error);
      }
    };

    if (patientAddress && loggedIn && role === "Patient") {
      loadAllConsentStatuses();
    }
  }, [patientAddress, loggedIn, role]);

  const handleGrant = async () => {
    if (!loggedIn || role !== "Patient") {
      setStatus({
        message: "Only logged-in patients can grant consent.",
        type: "error",
      });
      return;
    }

    if (!patientAddress) {
      setStatus({
        message: "Patient address not ready.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setStatus({
      message: "Granting consent on blockchain...",
      type: "loading",
    });

    try {
      await sendTransaction(
        () => blockchainClient.grantConsent(patientAddress, selectedConsumer),
        {
          to: selectedConsumer,
          functionName: "GRANT CONSENT"
        }
      );

      const providerName =
        HEALTHCARE_PROVIDERS.find((p) => p.address === selectedConsumer)
          ?.name || "Provider";
      setStatus({
        message: `Consent successfully granted to ${providerName}!`,
        type: "success",
      });

      // Update local status
      setConsentStatuses((prev) => ({
        ...prev,
        [selectedConsumer]: true,
      }));
    } catch (error: any) {
      console.error("Grant error:", error);
      setStatus({
        message: error.message || "Failed to grant consent. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!loggedIn || role !== "Patient") {
      setStatus({
        message: "Only logged-in patients can revoke consent.",
        type: "error",
      });
      return;
    }

    if (!patientAddress) {
      setStatus({
        message: "Patient address not ready.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setStatus({
      message: "Revoking consent on blockchain...",
      type: "loading",
    });

    try {
      await sendTransaction(
        () => blockchainClient.revokeConsent(patientAddress, selectedConsumer),
        {
          to: selectedConsumer,
          functionName: "REVOKE CONSENT"
        }
      );

      const providerName =
        HEALTHCARE_PROVIDERS.find((p) => p.address === selectedConsumer)
          ?.name || "Provider";
      setStatus({
        message: `Consent successfully revoked for ${providerName}!`,
        type: "success",
      });

      // Update local status
      setConsentStatuses((prev) => ({
        ...prev,
        [selectedConsumer]: false,
      }));
    } catch (error: any) {
      console.error("Revoke error:", error);
      setStatus({
        message: error.message || "Failed to revoke consent. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkConsent = async () => {
    if (!loggedIn || role !== "Patient") {
      setStatus({
        message: "Only logged-in patients can check consent status.",
        type: "error",
      });
      return;
    }

    if (!patientAddress) {
      setStatus({
        message: "Patient address not ready.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setStatus({
      message: "Checking consent status on blockchain...",
      type: "loading",
    });

    try {
      const hasConsent = await blockchainClient.hasConsent(
        patientAddress,
        selectedConsumer
      );
      const providerName =
        HEALTHCARE_PROVIDERS.find((p) => p.address === selectedConsumer)
          ?.name || "Provider";

      setStatus({
        message: `Consent status for ${providerName}: ${hasConsent ? "Granted" : "Not granted"
          }`,
        type: hasConsent ? "success" : "warning",
      });

      // Update local status
      setConsentStatuses((prev) => ({
        ...prev,
        [selectedConsumer]: hasConsent,
      }));
    } catch (error: any) {
      console.error("Check error:", error);
      setStatus({
        message: error.message || "Failed to check consent status.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <User className="h-4 w-4" />;
      case "specialist":
        return <UserCheck className="h-4 w-4" />;
      case "lab":
        return <Search className="h-4 w-4" />;
      case "hospital":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getProviderTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      doctor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      specialist:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      lab: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      hospital:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };

    const className =
      variants[type] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";

    return (
      <Badge className={className}>
        {getProviderIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
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
          <h1 className="text-2xl font-bold md:text-3xl">Manage Consent</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to manage consent settings.
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

  if (role !== "Patient") {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">Manage Consent</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <UserX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only patients can manage consent settings for their health
              records.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Manage Consent</h1>
          <p className="text-muted-foreground">
            Control who can access your health records
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
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Consent Management
              </CardTitle>
              <CardDescription>
                Grant or revoke access to your health records for healthcare
                providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientAddress">Your Patient Address</Label>
                <div className="p-3 bg-muted rounded-md font-mono text-sm">
                  {patientAddress}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Select Healthcare Provider</Label>
                <Select
                  value={selectedConsumer}
                  onValueChange={setSelectedConsumer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a healthcare provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEALTHCARE_PROVIDERS.map((provider) => (
                      <SelectItem
                        key={provider.address}
                        value={provider.address}
                      >
                        <div className="flex items-center gap-2">
                          {getProviderIcon(provider.type)}
                          <span>{provider.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({provider.address.slice(0, 6)}...
                            {provider.address.slice(-4)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleGrant}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-2" />
                  )}
                  Grant Consent
                </Button>
                <Button
                  onClick={handleRevoke}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserX className="h-4 w-4 mr-2" />
                  )}
                  Revoke Consent
                </Button>
                <Button
                  onClick={checkConsent}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Check Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Consent Status</CardTitle>
              <CardDescription>
                Overview of all healthcare providers and their access status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {HEALTHCARE_PROVIDERS.map((provider, index) => (
                  <div key={provider.address}>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getProviderIcon(provider.type)}
                        </div>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {provider.address.slice(0, 10)}...
                            {provider.address.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getProviderTypeBadge(provider.type)}
                        {consentStatuses[provider.address] !== undefined && (
                          <Badge
                            className={
                              consentStatuses[provider.address]
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }
                          >
                            {consentStatuses[provider.address] ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Granted
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Denied
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {index < HEALTHCARE_PROVIDERS.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Providers</span>
                <Badge variant="secondary">{HEALTHCARE_PROVIDERS.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Granted Access</span>
                <Badge variant="secondary">
                  {Object.values(consentStatuses).filter(Boolean).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Denied Access</span>
                <Badge variant="secondary">
                  {
                    Object.values(consentStatuses).filter((status) => !status)
                      .length
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Blockchain-secured consent
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Granular access control
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Revocable permissions
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Audit trail maintained
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Consent can be granted or revoked at any time</p>
              <p>• All changes are recorded on the blockchain</p>
              <p>• Providers need consent to access your records</p>
              <p>• Emergency access may override consent settings</p>
            </CardContent>
          </Card>
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

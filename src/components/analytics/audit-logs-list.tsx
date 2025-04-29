"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, ArrowRight, FileText, Lock, User } from "lucide-react";
import { useState } from "react";

interface AuditLogsListProps {
  searchQuery: string;
}

export function AuditLogsList({ searchQuery }: AuditLogsListProps) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Sample data
  const logs = [
    {
      id: "LOG-1234",
      timestamp: "2023-04-28 14:32:45",
      user: "Dr. Smith",
      action: "View Patient Record",
      resource: "Patient P-5678",
      status: "success",
      type: "access",
      details: {
        ipAddress: "192.168.1.45",
        browser: "Chrome 112.0.5615.138",
        device: "Desktop",
        location: "Hospital Main Building",
        duration: "2m 15s",
        additionalInfo: "Accessed patient medical history and lab results",
      },
    },
    {
      id: "LOG-2345",
      timestamp: "2023-04-28 13:15:30",
      user: "Nurse Johnson",
      action: "Update Patient Record",
      resource: "Patient P-6789",
      status: "success",
      type: "modification",
      details: {
        ipAddress: "192.168.1.67",
        browser: "Firefox 112.0.1",
        device: "Tablet",
        location: "Emergency Department",
        duration: "4m 30s",
        additionalInfo:
          "Updated vital signs and medication administration records",
      },
    },
    {
      id: "LOG-3456",
      timestamp: "2023-04-28 12:45:12",
      user: "System",
      action: "Blockchain Verification",
      resource: "Record REC-3456",
      status: "success",
      type: "system",
      details: {
        ipAddress: "192.168.0.10",
        browser: "System Process",
        device: "Server",
        location: "Data Center",
        duration: "0.5s",
        additionalInfo: "Automatic verification of record hash on blockchain",
      },
    },
    {
      id: "LOG-4567",
      timestamp: "2023-04-28 11:20:05",
      user: "Unknown",
      action: "Login Attempt",
      resource: "User Authentication",
      status: "failed",
      type: "access",
      details: {
        ipAddress: "203.0.113.45",
        browser: "Chrome 112.0.5615.138",
        device: "Mobile",
        location: "External Network",
        duration: "N/A",
        additionalInfo:
          "Failed login attempt with incorrect password (3rd attempt)",
      },
    },
    {
      id: "LOG-5678",
      timestamp: "2023-04-28 10:10:55",
      user: "Admin Wilson",
      action: "User Creation",
      resource: "User Management",
      status: "success",
      type: "system",
      details: {
        ipAddress: "192.168.1.22",
        browser: "Edge 112.0.1722.58",
        device: "Desktop",
        location: "IT Department",
        duration: "1m 45s",
        additionalInfo: "Created new user account for Dr. Emily Chen",
      },
    },
    {
      id: "LOG-6789",
      timestamp: "2023-04-28 09:05:40",
      user: "Dr. Brown",
      action: "Download Patient Data",
      resource: "Patient P-0123",
      status: "success",
      type: "access",
      details: {
        ipAddress: "192.168.1.89",
        browser: "Safari 16.4",
        device: "Desktop",
        location: "Cardiology Department",
        duration: "3m 10s",
        additionalInfo: "Downloaded patient records for referral to specialist",
      },
    },
    {
      id: "LOG-7890",
      timestamp: "2023-04-28 08:50:22",
      user: "System",
      action: "Backup Completed",
      resource: "Database",
      status: "success",
      type: "system",
      details: {
        ipAddress: "192.168.0.5",
        browser: "System Process",
        device: "Server",
        location: "Data Center",
        duration: "15m 22s",
        additionalInfo: "Daily system backup completed successfully",
      },
    },
  ];

  // Filter logs based on search query
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.id.toLowerCase().includes(query) ||
      log.user.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.resource.toLowerCase().includes(query) ||
      log.type.toLowerCase().includes(query)
    );
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case "access":
        return <User className="h-4 w-4" />;
      case "modification":
        return <FileText className="h-4 w-4" />;
      case "system":
        return <Lock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "success") {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Success
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Failed
        </Badge>
      );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "access":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-700 dark:text-blue-400"
          >
            Access
          </Badge>
        );
      case "modification":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-700 dark:text-purple-400"
          >
            Modification
          </Badge>
        );
      case "system":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-700 dark:text-green-400"
          >
            System
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Log ID</TableHead>
              <TableHead className="hidden md:table-cell">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {log.timestamp}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {log.action}
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell>{getTypeBadge(log.type)}</TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          {selectedLog && (
                            <>
                              <span className="mr-2">
                                {getLogIcon(selectedLog.type)}
                              </span>
                              {selectedLog.action}
                            </>
                          )}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedLog && (
                            <span>
                              {selectedLog.timestamp} • {selectedLog.id}
                            </span>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedLog && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">User</h4>
                              <p className="text-sm">{selectedLog.user}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Resource
                              </h4>
                              <p className="text-sm">{selectedLog.resource}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                IP Address
                              </h4>
                              <p className="text-sm">
                                {selectedLog.details.ipAddress}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Browser
                              </h4>
                              <p className="text-sm">
                                {selectedLog.details.browser}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Device
                              </h4>
                              <p className="text-sm">
                                {selectedLog.details.device}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Location
                              </h4>
                              <p className="text-sm">
                                {selectedLog.details.location}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Duration
                              </h4>
                              <p className="text-sm">
                                {selectedLog.details.duration}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Status
                              </h4>
                              <p className="text-sm">
                                {getStatusBadge(selectedLog.status)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Additional Information
                            </h4>
                            <p className="text-sm">
                              {selectedLog.details.additionalInfo}
                            </p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Copy } from "lucide-react";

interface BlockchainVerificationTableProps {
  searchQuery: string;
}

export function BlockchainVerificationTable({
  searchQuery,
}: BlockchainVerificationTableProps) {
  // Sample data
  const records = [
    {
      id: "REC-1234",
      patientId: "P-5678",
      recordType: "Medical History",
      timestamp: "2023-04-28 14:32:45",
      hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      status: "verified",
    },
    {
      id: "REC-2345",
      patientId: "P-6789",
      recordType: "Lab Results",
      timestamp: "2023-04-28 12:15:30",
      hash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      status: "verified",
    },
    {
      id: "REC-3456",
      patientId: "P-7890",
      recordType: "Prescription",
      timestamp: "2023-04-28 10:45:12",
      hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      status: "verified",
    },
    {
      id: "REC-4567",
      patientId: "P-8901",
      recordType: "Imaging Results",
      timestamp: "2023-04-27 16:20:05",
      hash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
      status: "verified",
    },
    {
      id: "REC-5678",
      patientId: "P-9012",
      recordType: "Vital Signs",
      timestamp: "2023-04-27 14:10:55",
      hash: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      status: "verified",
    },
    {
      id: "REC-6789",
      patientId: "P-0123",
      recordType: "Treatment Plan",
      timestamp: "2023-04-27 11:05:40",
      hash: "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
      status: "pending",
    },
    {
      id: "REC-7890",
      patientId: "P-1234",
      recordType: "Surgical Notes",
      timestamp: "2023-04-26 15:50:22",
      hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      status: "verified",
    },
  ];

  // Filter records based on search query
  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.id.toLowerCase().includes(query) ||
      record.patientId.toLowerCase().includes(query) ||
      record.hash.toLowerCase().includes(query) ||
      record.recordType.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Record ID</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Record Type</TableHead>
            <TableHead className="hidden md:table-cell">Timestamp</TableHead>
            <TableHead className="hidden md:table-cell">Hash</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.patientId}</TableCell>
              <TableCell>{record.recordType}</TableCell>
              <TableCell className="hidden md:table-cell">
                {record.timestamp}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <span className="truncate max-w-[120px]">{record.hash}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy hash</span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {record.status === "verified" ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  Verify
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

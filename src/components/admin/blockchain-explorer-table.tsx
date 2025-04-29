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
import { ArrowRight, Copy, FileText, Lock, User } from "lucide-react";
import { useState } from "react";

interface BlockchainExplorerTableProps {
  searchQuery: string;
}

export function BlockchainExplorerTable({
  searchQuery,
}: BlockchainExplorerTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );

  // Sample data
  const transactions = [
    {
      id: "TX-1234",
      timestamp: "2023-04-28 14:32:45",
      type: "record",
      initiator: "Dr. Smith",
      action: "Update Patient Record",
      blockNumber: 24892,
      hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      details: {
        patientId: "P-5678",
        recordType: "Medical History",
        changes: "Updated diagnosis and treatment plan",
        previousHash: "0x6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
        gasUsed: "0.00012 ETH",
        confirmations: 24,
      },
    },
    {
      id: "TX-2345",
      timestamp: "2023-04-28 13:15:30",
      type: "access",
      initiator: "Nurse Johnson",
      action: "View Patient Record",
      blockNumber: 24891,
      hash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      details: {
        patientId: "P-6789",
        recordType: "Lab Results",
        changes: "No changes (read-only access)",
        previousHash: "N/A",
        gasUsed: "0.00008 ETH",
        confirmations: 25,
      },
    },
    {
      id: "TX-3456",
      timestamp: "2023-04-28 12:45:12",
      type: "system",
      initiator: "System",
      action: "Node Configuration Update",
      blockNumber: 24890,
      hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      details: {
        patientId: "N/A",
        recordType: "System Configuration",
        changes: "Updated fog node #12 configuration parameters",
        previousHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
        gasUsed: "0.00015 ETH",
        confirmations: 26,
      },
    },
    {
      id: "TX-4567",
      timestamp: "2023-04-28 11:20:05",
      type: "record",
      initiator: "Dr. Brown",
      action: "Create Patient Record",
      blockNumber: 24889,
      hash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
      details: {
        patientId: "P-8901",
        recordType: "New Patient",
        changes: "Created new patient record",
        previousHash: "N/A",
        gasUsed: "0.00025 ETH",
        confirmations: 27,
      },
    },
    {
      id: "TX-5678",
      timestamp: "2023-04-28 10:10:55",
      type: "access",
      initiator: "Admin Wilson",
      action: "Audit Log Review",
      blockNumber: 24888,
      hash: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      details: {
        patientId: "Multiple",
        recordType: "Audit Logs",
        changes: "No changes (administrative review)",
        previousHash: "N/A",
        gasUsed: "0.00010 ETH",
        confirmations: 28,
      },
    },
    {
      id: "TX-6789",
      timestamp: "2023-04-28 09:05:40",
      type: "system",
      initiator: "System",
      action: "Blockchain Verification",
      blockNumber: 24887,
      hash: "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
      details: {
        patientId: "N/A",
        recordType: "System Verification",
        changes: "Automatic verification of blockchain integrity",
        previousHash: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        gasUsed: "0.00018 ETH",
        confirmations: 29,
      },
    },
    {
      id: "TX-7890",
      timestamp: "2023-04-28 08:50:22",
      type: "record",
      initiator: "Dr. Chen",
      action: "Update Patient Record",
      blockNumber: 24886,
      hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      details: {
        patientId: "P-1234",
        recordType: "Prescription",
        changes: "Updated medication dosage",
        previousHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
        gasUsed: "0.00014 ETH",
        confirmations: 30,
      },
    },
  ];

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tx.id.toLowerCase().includes(query) ||
      tx.hash.toLowerCase().includes(query) ||
      tx.initiator.toLowerCase().includes(query) ||
      tx.action.toLowerCase().includes(query) ||
      tx.details.patientId.toLowerCase().includes(query)
    );
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "record":
        return <FileText className="h-4 w-4" />;
      case "access":
        return <User className="h-4 w-4" />;
      case "system":
        return <Lock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "record":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-700 dark:text-blue-400"
          >
            Record Update
          </Badge>
        );
      case "access":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-700 dark:text-purple-400"
          >
            Access Log
          </Badge>
        );
      case "system":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-700 dark:text-green-400"
          >
            System Event
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
              <TableHead className="w-[80px]">TX ID</TableHead>
              <TableHead className="hidden md:table-cell">Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Initiator</TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
              <TableHead>Block #</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {tx.timestamp}
                </TableCell>
                <TableCell>{getTypeBadge(tx.type)}</TableCell>
                <TableCell>{tx.initiator}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {tx.action}
                </TableCell>
                <TableCell>{tx.blockNumber}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          {selectedTransaction && (
                            <>
                              <span className="mr-2">
                                {getTransactionIcon(selectedTransaction.type)}
                              </span>
                              {selectedTransaction.action}
                            </>
                          )}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedTransaction && (
                            <span>
                              {selectedTransaction.timestamp} •{" "}
                              {selectedTransaction.id}
                            </span>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTransaction && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Initiator
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.initiator}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Patient ID
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.details.patientId}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Record Type
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.details.recordType}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Block Number
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.blockNumber}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <h4 className="text-sm font-medium mb-1">
                                Transaction Hash
                              </h4>
                              <div className="flex items-center">
                                <p className="text-sm font-mono truncate">
                                  {selectedTransaction.hash}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-1"
                                >
                                  <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copy hash</span>
                                </Button>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Gas Used
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.details.gasUsed}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Confirmations
                              </h4>
                              <p className="text-sm">
                                {selectedTransaction.details.confirmations}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Changes
                            </h4>
                            <p className="text-sm">
                              {selectedTransaction.details.changes}
                            </p>
                          </div>
                          {selectedTransaction.details.previousHash !==
                            "N/A" && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Previous Hash
                              </h4>
                              <div className="flex items-center">
                                <p className="text-sm font-mono truncate">
                                  {selectedTransaction.details.previousHash}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-1"
                                >
                                  <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copy hash</span>
                                </Button>
                              </div>
                            </div>
                          )}
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

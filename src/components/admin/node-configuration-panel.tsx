"use client";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Database,
  HardDrive,
  MoreHorizontal,
  RefreshCw,
  Server,
  Settings,
  Trash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NodeConfigurationPanelProps {
  searchQuery: string;
}

export function NodeConfigurationPanel({
  searchQuery,
}: NodeConfigurationPanelProps) {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);
  const [restartDialogOpen, setRestartDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // Sample data
  const nodes = [
    {
      id: "NODE-001",
      name: "Primary Hospital Node",
      type: "hospital",
      location: "Main Building",
      status: "healthy",
      uptime: "99.98%",
      lastRestart: "2023-04-15 08:30:22",
      ipAddress: "192.168.1.10",
      resources: {
        cpu: 32,
        memory: 64,
        storage: 2048,
        cpuUsage: 38,
        memoryUsage: 42,
        storageUsage: 35,
      },
      config: {
        processingPriority: "high",
        dataRetentionDays: 90,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 500,
        autoScaling: true,
      },
    },
    {
      id: "NODE-002",
      name: "Emergency Department Node",
      type: "department",
      location: "Emergency Wing",
      status: "healthy",
      uptime: "99.95%",
      lastRestart: "2023-04-18 12:15:45",
      ipAddress: "192.168.1.11",
      resources: {
        cpu: 16,
        memory: 32,
        storage: 1024,
        cpuUsage: 65,
        memoryUsage: 58,
        storageUsage: 42,
      },
      config: {
        processingPriority: "critical",
        dataRetentionDays: 60,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 250,
        autoScaling: true,
      },
    },
    {
      id: "NODE-003",
      name: "Radiology Department Node",
      type: "department",
      location: "Imaging Center",
      status: "healthy",
      uptime: "99.92%",
      lastRestart: "2023-04-20 06:45:12",
      ipAddress: "192.168.1.12",
      resources: {
        cpu: 24,
        memory: 48,
        storage: 4096,
        cpuUsage: 45,
        memoryUsage: 62,
        storageUsage: 78,
      },
      config: {
        processingPriority: "high",
        dataRetentionDays: 120,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 200,
        autoScaling: true,
      },
    },
    {
      id: "NODE-004",
      name: "Laboratory Node",
      type: "department",
      location: "Lab Building",
      status: "warning",
      uptime: "98.75%",
      lastRestart: "2023-04-22 14:30:55",
      ipAddress: "192.168.1.13",
      resources: {
        cpu: 16,
        memory: 32,
        storage: 2048,
        cpuUsage: 82,
        memoryUsage: 75,
        storageUsage: 48,
      },
      config: {
        processingPriority: "high",
        dataRetentionDays: 90,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 150,
        autoScaling: true,
      },
    },
    {
      id: "NODE-005",
      name: "Remote Clinic Node",
      type: "clinic",
      location: "Satellite Clinic",
      status: "critical",
      uptime: "85.20%",
      lastRestart: "2023-04-25 09:15:30",
      ipAddress: "192.168.2.10",
      resources: {
        cpu: 8,
        memory: 16,
        storage: 1024,
        cpuUsage: 25,
        memoryUsage: 40,
        storageUsage: 55,
      },
      config: {
        processingPriority: "medium",
        dataRetentionDays: 60,
        encryptionLevel: "AES-256",
        backupFrequency: "daily",
        maxConnections: 100,
        autoScaling: false,
      },
    },
    {
      id: "NODE-006",
      name: "Patient Monitoring Edge Node",
      type: "edge",
      location: "ICU",
      status: "healthy",
      uptime: "99.99%",
      lastRestart: "2023-04-10 10:20:15",
      ipAddress: "192.168.1.20",
      resources: {
        cpu: 4,
        memory: 8,
        storage: 512,
        cpuUsage: 35,
        memoryUsage: 42,
        storageUsage: 28,
      },
      config: {
        processingPriority: "critical",
        dataRetentionDays: 30,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 50,
        autoScaling: false,
      },
    },
    {
      id: "NODE-007",
      name: "Cardiology Department Node",
      type: "department",
      location: "Heart Center",
      status: "healthy",
      uptime: "99.95%",
      lastRestart: "2023-04-17 07:45:22",
      ipAddress: "192.168.1.14",
      resources: {
        cpu: 16,
        memory: 32,
        storage: 2048,
        cpuUsage: 48,
        memoryUsage: 52,
        storageUsage: 45,
      },
      config: {
        processingPriority: "high",
        dataRetentionDays: 90,
        encryptionLevel: "AES-256",
        backupFrequency: "hourly",
        maxConnections: 150,
        autoScaling: true,
      },
    },
  ];

  // Filter nodes based on search query
  const filteredNodes = nodes.filter((node) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      node.id.toLowerCase().includes(query) ||
      node.name.toLowerCase().includes(query) ||
      node.type.toLowerCase().includes(query) ||
      node.location.toLowerCase().includes(query) ||
      node.ipAddress.toLowerCase().includes(query)
    );
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Server className="h-5 w-5 text-blue-500" />;
      case "department":
        return <Database className="h-5 w-5 text-purple-500" />;
      case "clinic":
        return <HardDrive className="h-5 w-5 text-green-500" />;
      case "edge":
        return <HardDrive className="h-5 w-5 text-amber-500" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Healthy
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResourceUsageColor = (usage: number) => {
    if (usage < 50) return "bg-green-500";
    if (usage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleConfigureNode = (node: any) => {
    setSelectedNode(node);
    setConfigDialogOpen(true);
  };

  const handleRestartNode = (node: any) => {
    setSelectedNode(node);
    setRestartDialogOpen(true);
  };

  const handleDeleteNode = (node: any) => {
    setSelectedNode(node);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">IP Address</TableHead>
              <TableHead className="hidden md:table-cell">Uptime</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <div className="font-medium">{node.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {node.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{node.type}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {node.location}
                </TableCell>
                <TableCell>{getStatusBadge(node.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {node.ipAddress}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {node.uptime}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleConfigureNode(node)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRestartNode(node)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDeleteNode(node)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Node Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure Node</DialogTitle>
            <DialogDescription>
              {selectedNode && (
                <span>
                  {selectedNode.name} ({selectedNode.id})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nodeName" className="text-right">
                    Node Name
                  </Label>
                  <Input
                    id="nodeName"
                    defaultValue={selectedNode.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nodeType" className="text-right">
                    Type
                  </Label>
                  <Select defaultValue={selectedNode.type}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="edge">Edge Device</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nodeLocation" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="nodeLocation"
                    defaultValue={selectedNode.location}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nodeIp" className="text-right">
                    IP Address
                  </Label>
                  <Input
                    id="nodeIp"
                    defaultValue={selectedNode.ipAddress}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="processingPriority" className="text-right">
                    Processing Priority
                  </Label>
                  <Select defaultValue={selectedNode.config.processingPriority}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="resources" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>CPU Allocation</Label>
                      <span className="text-sm">
                        {selectedNode.resources.cpu} cores
                      </span>
                    </div>
                    <Input
                      type="range"
                      min="2"
                      max="64"
                      step="2"
                      defaultValue={selectedNode.resources.cpu}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Memory Allocation</Label>
                      <span className="text-sm">
                        {selectedNode.resources.memory} GB
                      </span>
                    </div>
                    <Input
                      type="range"
                      min="4"
                      max="128"
                      step="4"
                      defaultValue={selectedNode.resources.memory}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Storage Allocation</Label>
                      <span className="text-sm">
                        {selectedNode.resources.storage} GB
                      </span>
                    </div>
                    <Input
                      type="range"
                      min="256"
                      max="8192"
                      step="256"
                      defaultValue={selectedNode.resources.storage}
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">
                      Current Resource Usage
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">CPU Usage</span>
                          <span className="text-sm font-medium">
                            {selectedNode.resources.cpuUsage}%
                          </span>
                        </div>
                        <Progress
                          value={selectedNode.resources.cpuUsage}
                          className="h-2"
                        >
                          <div
                            className={`h-full rounded-full ${getResourceUsageColor(
                              selectedNode.resources.cpuUsage
                            )}`}
                          />
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Memory Usage</span>
                          <span className="text-sm font-medium">
                            {selectedNode.resources.memoryUsage}%
                          </span>
                        </div>
                        <Progress
                          value={selectedNode.resources.memoryUsage}
                          className="h-2"
                        >
                          <div
                            className={`h-full rounded-full ${getResourceUsageColor(
                              selectedNode.resources.memoryUsage
                            )}`}
                          />
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Storage Usage</span>
                          <span className="text-sm font-medium">
                            {selectedNode.resources.storageUsage}%
                          </span>
                        </div>
                        <Progress
                          value={selectedNode.resources.storageUsage}
                          className="h-2"
                        >
                          <div
                            className={`h-full rounded-full ${getResourceUsageColor(
                              selectedNode.resources.storageUsage
                            )}`}
                          />
                        </Progress>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dataRetention" className="text-right">
                    Data Retention
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="dataRetention"
                      type="number"
                      defaultValue={selectedNode.config.dataRetentionDays}
                      className="w-20"
                    />
                    <span>days</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="encryption" className="text-right">
                    Encryption Level
                  </Label>
                  <Select defaultValue={selectedNode.config.encryptionLevel}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES-128">AES-128</SelectItem>
                      <SelectItem value="AES-256">AES-256</SelectItem>
                      <SelectItem value="AES-512">AES-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="backupFrequency" className="text-right">
                    Backup Frequency
                  </Label>
                  <Select defaultValue={selectedNode.config.backupFrequency}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxConnections" className="text-right">
                    Max Connections
                  </Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    defaultValue={selectedNode.config.maxConnections}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="autoScaling" className="text-right">
                    Auto Scaling
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <input
                      type="checkbox"
                      id="autoScaling"
                      defaultChecked={selectedNode.config.autoScaling}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="autoScaling"
                      className="text-sm font-normal"
                    >
                      Enable automatic resource scaling based on load
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart Node Dialog */}
      <Dialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restart Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to restart this node? This will temporarily
              disrupt services.
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You are about to restart the following node:
              </p>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedNode.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.id} • {selectedNode.ipAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestartDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Node Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this node? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You are about to delete the following node:
              </p>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedNode.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.id} • {selectedNode.ipAddress}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  Warning
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Deleting this node will remove it from the network and may
                  cause data loss or service disruption. Make sure to migrate
                  any critical services before proceeding.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

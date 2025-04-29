"use client";

import { BlockchainExplorerTable } from "@/components/admin/blockchain-explorer-table";
import { NodeConfigurationPanel } from "@/components/admin/node-configuration-panel";
import { SystemHealthChart } from "@/components/admin/system-health-chart";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  ChevronDown,
  Database,
  FileText,
  HardDrive,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Administrative Interface
          </h1>
          <p className="text-muted-foreground">
            Manage system components and users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh data</span>
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">System Dashboard</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Explorer</TabsTrigger>
          <TabsTrigger value="nodes">Node Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">98.7%</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Healthy
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Overall system health score
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Blockchain Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">Active</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Synced
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last block: 2 minutes ago
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fog Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">24/25</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    1 Offline
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Active fog computing nodes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">42</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    8 Admins
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Currently active system users
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-t-4 border-t-blue-500 dark:border-t-blue-400">
            <CardHeader>
              <CardTitle>System Health Metrics</CardTitle>
              <CardDescription>
                Overall health metrics, blockchain status, and fog node
                performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <SystemHealthChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current system resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm font-medium">37%</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Network Bandwidth
                      </span>
                      <span className="text-sm font-medium">54%</span>
                    </div>
                    <Progress value={54} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Blockchain Processing
                      </span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Warning
                      </Badge>
                      <span className="font-medium">
                        Remote Clinic Node Offline
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Node has been offline for 15 minutes. Automatic
                      reconnection attempts in progress.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>2 minutes ago</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        Acknowledge
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Info
                      </Badge>
                      <span className="font-medium">
                        System Backup Completed
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Daily system backup completed successfully. All data
                      secured.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>45 minutes ago</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        Dismiss
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Critical
                      </Badge>
                      <span className="font-medium">
                        Unauthorized Access Attempt
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Multiple failed login attempts detected from IP
                      192.168.1.45. Account locked.
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>1 hour ago</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="nurse">Nurses</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Button>Add User</Button>
          </div>

          <Card className="border-t-4 border-t-purple-500 dark:border-t-purple-400">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage healthcare providers and staff accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagementTable searchQuery={searchQuery} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 10 of 42 users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Distribution of user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Administrators
                      </span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <Progress
                      value={19}
                      className="h-2 bg-blue-100 dark:bg-blue-900"
                    >
                      <div className="h-full bg-blue-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Doctors</span>
                      <span className="text-sm font-medium">15</span>
                    </div>
                    <Progress
                      value={36}
                      className="h-2 bg-green-100 dark:bg-green-900"
                    >
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Nurses</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <Progress
                      value={29}
                      className="h-2 bg-purple-100 dark:bg-purple-900"
                    >
                      <div className="h-full bg-purple-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Staff</span>
                      <span className="text-sm font-medium">7</span>
                    </div>
                    <Progress
                      value={17}
                      className="h-2 bg-amber-100 dark:bg-amber-900"
                    >
                      <div className="h-full bg-amber-500 rounded-full" />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Currently logged in users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Dr. {["Smith", "Johnson", "Williams", "Brown"][i - 1]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Active for {Math.floor(Math.random() * 120) + 5}{" "}
                          minutes
                        </p>
                      </div>
                      <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Online
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>User activity log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-3 pb-3">
                    <p className="text-sm font-medium">User Created</p>
                    <p className="text-xs text-muted-foreground">
                      Dr. Emily Chen added to system
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      10 minutes ago
                    </p>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-3 pb-3">
                    <p className="text-sm font-medium">Role Modified</p>
                    <p className="text-xs text-muted-foreground">
                      James Wilson promoted to Senior Nurse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      45 minutes ago
                    </p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-3 pb-3">
                    <p className="text-sm font-medium">Account Locked</p>
                    <p className="text-xs text-muted-foreground">
                      Sarah Johnson's account locked after 5 failed attempts
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3">
                    <p className="text-sm font-medium">Password Reset</p>
                    <p className="text-xs text-muted-foreground">
                      Dr. Michael Brown requested password reset
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by transaction hash, block number, or patient ID"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="record">Record Update</SelectItem>
                <SelectItem value="access">Access Log</SelectItem>
                <SelectItem value="system">System Event</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>

          <Card className="border-t-4 border-t-green-500 dark:border-t-green-400">
            <CardHeader>
              <CardTitle>Blockchain Explorer</CardTitle>
              <CardDescription>
                View and audit blockchain transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainExplorerTable searchQuery={searchQuery} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 10 of 1,247 transactions
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Statistics</CardTitle>
                <CardDescription>Current blockchain metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Total Blocks</span>
                    </div>
                    <span className="font-medium">24,892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Total Transactions</span>
                    </div>
                    <span className="font-medium">1,247,568</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Consensus Algorithm</span>
                    </div>
                    <span className="font-medium">
                      PoA (Proof of Authority)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Blockchain Size</span>
                    </div>
                    <span className="font-medium">2.4 GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Validator Nodes</span>
                    </div>
                    <span className="font-medium">5 active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
                <CardDescription>
                  Distribution of transaction types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Patient Record Updates
                      </span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <Progress
                      value={48}
                      className="h-2 bg-blue-100 dark:bg-blue-900"
                    >
                      <div className="h-full bg-blue-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Access Logs</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <Progress
                      value={32}
                      className="h-2 bg-purple-100 dark:bg-purple-900"
                    >
                      <div className="h-full bg-purple-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">System Events</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <Progress
                      value={12}
                      className="h-2 bg-green-100 dark:bg-green-900"
                    >
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        User Management
                      </span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <Progress
                      value={8}
                      className="h-2 bg-amber-100 dark:bg-amber-900"
                    >
                      <div className="h-full bg-amber-500 rounded-full" />
                    </Progress>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Recent Blocks</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center p-2 rounded-md bg-green-50 dark:bg-green-950/30"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mr-3">
                          <Database className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            Block #{24892 - i}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {42 - i * 12} transactions • {i * 5} minutes ago
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search nodes"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Node Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="edge">Edge Device</SelectItem>
              </SelectContent>
            </Select>
            <Button>Add Node</Button>
          </div>

          <Card className="border-t-4 border-t-amber-500 dark:border-t-amber-400">
            <CardHeader>
              <CardTitle>Node Configuration</CardTitle>
              <CardDescription>
                Manage simulated fog nodes in the healthcare network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NodeConfigurationPanel searchQuery={searchQuery} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Node Types</CardTitle>
                <CardDescription>
                  Distribution of fog node types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Hospital Nodes
                      </span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <Progress
                      value={20}
                      className="h-2 bg-blue-100 dark:bg-blue-900"
                    >
                      <div className="h-full bg-blue-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Clinic Nodes</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <Progress
                      value={32}
                      className="h-2 bg-green-100 dark:bg-green-900"
                    >
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Department Nodes
                      </span>
                      <span className="text-sm font-medium">10</span>
                    </div>
                    <Progress
                      value={40}
                      className="h-2 bg-purple-100 dark:bg-purple-900"
                    >
                      <div className="h-full bg-purple-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Edge Devices</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <Progress
                      value={8}
                      className="h-2 bg-amber-100 dark:bg-amber-900"
                    >
                      <div className="h-full bg-amber-500 rounded-full" />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Node Health</CardTitle>
                <CardDescription>Current status of fog nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-md bg-green-50 dark:bg-green-950/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Healthy</span>
                    </div>
                    <span className="font-medium">20 nodes</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-amber-50 dark:bg-amber-950/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>Warning</span>
                    </div>
                    <span className="font-medium">4 nodes</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-red-50 dark:bg-red-950/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Critical</span>
                    </div>
                    <span className="font-medium">1 node</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Avg. Response Time
                      </div>
                      <div className="text-lg font-medium">12ms</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Avg. Uptime
                      </div>
                      <div className="text-lg font-medium">99.7%</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Data Processed
                      </div>
                      <div className="text-lg font-medium">1.2 TB</div>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Avg. CPU Load
                      </div>
                      <div className="text-lg font-medium">42%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Topology</CardTitle>
                <CardDescription>Fog node network structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg flex items-center justify-center border border-blue-100 dark:border-blue-900 overflow-hidden">
                  <div className="text-center p-4">
                    <HardDrive className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Network Visualization</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Interactive topology map
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Open Full View
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">
                    Recent Node Events
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Node #12 restarted
                      </span>
                      <span>10 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Node #5 configuration updated
                      </span>
                      <span>25 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Node #18 added to network
                      </span>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

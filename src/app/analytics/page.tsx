"use client";

import { AuditLogsList } from "@/components/analytics/audit-logs-list";
import { BlockchainVerificationTable } from "@/components/analytics/blockchain-verification-table";
import { PredictiveAnalyticsChart } from "@/components/analytics/predictive-analytics-chart";
import { RealTimeAnalyticsChart } from "@/components/analytics/real-time-analytics-chart";
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
  CheckCircle,
  Clock,
  Database,
  FileText,
  LineChart,
  RefreshCw,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("24h");
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
            Analytics & Reporting
          </h1>
          <p className="text-muted-foreground">
            Monitor system performance and verify data integrity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </div>

      <Tabs defaultValue="real-time" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="real-time">Real-time Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="real-time" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-500" />
                    <div className="text-2xl font-bold">12ms</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    -8% from avg
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Average fog node processing time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Nodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-purple-500" />
                    <div className="text-2xl font-bold">24/25</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    96% uptime
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Fog nodes currently active in the network
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
                    <Shield className="mr-2 h-5 w-5 text-green-500" />
                    <div className="text-2xl font-bold">Healthy</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    100% integrity
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last block verified 2 minutes ago
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-t-4 border-t-blue-500 dark:border-t-blue-400">
            <CardHeader>
              <CardTitle>Real-time System Performance</CardTitle>
              <CardDescription>
                Demonstrating fog computing advantages in data processing
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <RealTimeAnalyticsChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing Metrics</CardTitle>
                <CardDescription>Current fog node performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Response Time</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">12ms</span>
                      <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Fast
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Data Throughput</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">1.2 GB/s</span>
                      <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Optimal
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <LineChart className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>CPU Utilization</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">42%</span>
                      <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Normal
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Memory Usage</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">3.8 GB</span>
                      <Badge className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Moderate
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Fog node connectivity status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>Primary Hospital Node</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>Emergency Department Node</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>Radiology Department Node</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Laboratory Node</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      High Latency
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                      <span>Remote Clinic Node</span>
                    </div>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Disconnected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6 mt-6">
          <Card className="border-t-4 border-t-purple-500 dark:border-t-purple-400">
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                Using historical patient data for insights and trend forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <PredictiveAnalyticsChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Readmission Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">12.4%</div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    -2.1% from last month
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Predicted 30-day readmission rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Resource Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">87.2%</div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    +3.5% from last month
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Predicted resource utilization next week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Treatment Efficacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">92.8%</div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    +1.2% from last month
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Predicted treatment success rate
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Outcome Predictions</CardTitle>
                <CardDescription>
                  Based on historical data patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <h4 className="font-medium mb-2">Diabetes Management</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on 1,245 similar patient profiles
                    </p>
                    <div className="flex justify-between items-center">
                      <span>Complication Risk:</span>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Medium (24%)
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Recommended Action:</span>
                      <span className="text-sm font-medium">
                        Increase monitoring frequency
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <h4 className="font-medium mb-2">Post-Surgery Recovery</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on 892 similar patient profiles
                    </p>
                    <div className="flex justify-between items-center">
                      <span>Recovery Timeline:</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Faster than average
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Recommended Action:</span>
                      <span className="text-sm font-medium">
                        Standard follow-up protocol
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <h4 className="font-medium mb-2">Cardiac Monitoring</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on 567 similar patient profiles
                    </p>
                    <div className="flex justify-between items-center">
                      <span>Risk Level:</span>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        High (38%)
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Recommended Action:</span>
                      <span className="text-sm font-medium">
                        Immediate intervention required
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Forecasting</CardTitle>
                <CardDescription>
                  Predicted resource needs for next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>ICU Bed Utilization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">92%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>Emergency Department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">78%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>General Ward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">65%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>Operating Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">82%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: "82%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>Diagnostic Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">73%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: "73%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span>Staff Utilization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">88%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </div>
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
                placeholder="Search by record ID, hash, or patient ID"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Verify</Button>
          </div>

          <Card className="border-t-4 border-t-green-500 dark:border-t-green-400">
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>
                Validate the integrity of healthcare records on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainVerificationTable searchQuery={searchQuery} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Verification Statistics</CardTitle>
                <CardDescription>
                  Last 30 days of blockchain activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Records Processed</span>
                    </div>
                    <span className="font-medium">12,458</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span>Verified Records</span>
                    </div>
                    <span className="font-medium">12,458 (100%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Average Verification Time</span>
                    </div>
                    <span className="font-medium">1.2 seconds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Blockchain Size</span>
                    </div>
                    <span className="font-medium">2.4 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
                <CardDescription>Last 5 verified records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 rounded-md bg-green-50 dark:bg-green-950/30"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Record #{Math.floor(Math.random() * 10000)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Hash: 0x
                          {Array.from({ length: 8 }, () =>
                            Math.floor(Math.random() * 16).toString(16)
                          ).join("")}
                          ...
                        </p>
                      </div>
                      <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Verified
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search audit logs"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Log Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="access">Access Logs</SelectItem>
                <SelectItem value="modification">Modification Logs</SelectItem>
                <SelectItem value="system">System Logs</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>

          <Card className="border-t-4 border-t-blue-500 dark:border-t-blue-400">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Track all system interactions and data access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogsList searchQuery={searchQuery} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Logs Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">1,247</div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    +18% from yesterday
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  System and user activity logs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Access Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">24</div>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  >
                    3 unauthorized
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unauthorized access attempts flagged
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Data Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">342</div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    100% verified
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  All changes verified on blockchain
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

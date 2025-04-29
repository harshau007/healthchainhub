"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Shield, Trash, User } from "lucide-react";
import { useState } from "react";

interface UserManagementTableProps {
  searchQuery: string;
}

export function UserManagementTable({ searchQuery }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // Sample data
  const users = [
    {
      id: "USR-1234",
      name: "Dr. John Smith",
      email: "john.smith@hospital.org",
      role: "Doctor",
      department: "Cardiology",
      status: "active",
      lastActive: "2023-04-28 14:32:45",
    },
    {
      id: "USR-2345",
      name: "Nurse Sarah Johnson",
      email: "sarah.johnson@hospital.org",
      role: "Nurse",
      department: "Emergency",
      status: "active",
      lastActive: "2023-04-28 13:15:30",
    },
    {
      id: "USR-3456",
      name: "Dr. Michael Brown",
      email: "michael.brown@hospital.org",
      role: "Doctor",
      department: "Neurology",
      status: "active",
      lastActive: "2023-04-28 12:45:12",
    },
    {
      id: "USR-4567",
      name: "Admin James Wilson",
      email: "james.wilson@hospital.org",
      role: "Administrator",
      department: "IT",
      status: "active",
      lastActive: "2023-04-28 11:20:05",
    },
    {
      id: "USR-5678",
      name: "Dr. Emily Chen",
      email: "emily.chen@hospital.org",
      role: "Doctor",
      department: "Pediatrics",
      status: "active",
      lastActive: "2023-04-28 10:10:55",
    },
    {
      id: "USR-6789",
      name: "Nurse Robert Davis",
      email: "robert.davis@hospital.org",
      role: "Nurse",
      department: "Surgery",
      status: "inactive",
      lastActive: "2023-04-27 15:05:40",
    },
    {
      id: "USR-7890",
      name: "Dr. Lisa Martinez",
      email: "lisa.martinez@hospital.org",
      role: "Doctor",
      department: "Oncology",
      status: "active",
      lastActive: "2023-04-28 09:50:22",
    },
    {
      id: "USR-8901",
      name: "Staff Alex Turner",
      email: "alex.turner@hospital.org",
      role: "Staff",
      department: "Radiology",
      status: "active",
      lastActive: "2023-04-28 08:45:15",
    },
    {
      id: "USR-9012",
      name: "Admin Olivia Parker",
      email: "olivia.parker@hospital.org",
      role: "Administrator",
      department: "Management",
      status: "active",
      lastActive: "2023-04-28 07:30:10",
    },
    {
      id: "USR-0123",
      name: "Dr. William Taylor",
      email: "william.taylor@hospital.org",
      role: "Doctor",
      department: "Orthopedics",
      status: "locked",
      lastActive: "2023-04-26 16:20:05",
    },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Administrator":
        return (
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "Doctor":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Doctor
          </Badge>
        );
      case "Nurse":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Nurse
          </Badge>
        );
      case "Staff":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Staff
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
            Inactive
          </Badge>
        );
      case "locked":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Locked
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.id.split("-")[1]}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.department}
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue={selectedUser.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue={selectedUser.email}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  id="department"
                  defaultValue={selectedUser.department}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You are about to delete the following user:
              </p>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.role} • {selectedUser.department}
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
            <Button variant="destructive">Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

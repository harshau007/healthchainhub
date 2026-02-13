export type Role = "None" | "Patient" | "Doctor" | "Admin";

export interface HealthRecord {
    dataHash: string;
    timestamp: number;
    recordType: string;
}

export interface UserInfo {
    address: string;
    role: Role;
    isRegistered: boolean;
}

export interface AccessRequest {
    id: string;
    from: string; // Doctor
    to: string;   // Patient
    status: "Pending" | "Approved" | "Rejected";
    timestamp: number;
}

export interface Invoice {
    id: string;
    provider: string; // Doctor/Lab
    patient: string;
    amount: string; // ETH
    service: string;
    status: "Pending" | "Paid";
    timestamp: number;
    txHash?: string;
}

export interface EmergencyLog {
    id: string;
    doctor: string;
    patient: string;
    reason: string;
    timestamp: number;
}

export interface Transaction {
    hash: string;
    from: string;
    to?: string;
    action: string;
    data: any;
    timestamp: number;
    status: "Success" | "Failed";
}

export interface SimulationData {
    users: Record<string, UserInfo>;
    // patient address -> list of records
    records: Record<string, HealthRecord[]>;
    // patient address -> (doctor address -> boolean)
    consent: Record<string, Record<string, boolean>>;

    // patient address -> beneficiary address
    beneficiaries: Record<string, string>;

    // list of access requests
    accessRequests: AccessRequest[];

    // list of invoices
    invoices: Invoice[];

    // list of tips for audit logs
    tips: Array<{
        from: string;
        to: string;
        amount: string;
        message: string;
        timestamp: number;
    }>;

    // critical audit logs
    emergencyLogs: EmergencyLog[];

    // list of all transactions
    transactions: Transaction[];
}

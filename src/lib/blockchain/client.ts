import { AccessRequest, Invoice } from "./types";

export class BlockchainClient {
    private static instance: BlockchainClient;

    private constructor() { }

    public static getInstance(): BlockchainClient {
        if (!BlockchainClient.instance) {
            BlockchainClient.instance = new BlockchainClient();
        }
        return BlockchainClient.instance;
    }

    // --- Auth & Wallet Helpers ---
    // In a real app we'd use ethers/wagmi. Here we simulate "connecting" by just generating/storing a random address
    // or letting the user pick one. For simplicity, we'll manage a session in localStorage if we were client-side,
    // but this class might be used in server components too? No, mostly client components.

    // Note: emulate ethers.js-like behavior where possible or just simple async methods.

    private async post(action: string, body: any) {
        const res = await fetch(`/api/blockchain/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Request failed");
        return json.result;
    }

    private async get(action: string, params: Record<string, string>) {
        const search = new URLSearchParams(params).toString();
        const res = await fetch(`/api/blockchain/${action}?${search}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Request failed");
        return json.result;
    }

    // --- Interface Methods ---

    async isRegistered(address: string): Promise<boolean> {
        return this.get("isRegistered", { address });
    }

    async getRole(address: string): Promise<number> { // 0=None, 1=Patient, 2=Doctor
        return this.get("getRole", { address });
    }

    async register(address: string, roleIndex: number): Promise<boolean> {
        return this.post("register", { address, roleIndex });
    }

    async grantConsent(patient: string, consumer: string): Promise<void> {
        return this.post("grantConsent", { patient, consumer });
    }

    async revokeConsent(patient: string, consumer: string): Promise<void> {
        return this.post("revokeConsent", { patient, consumer });
    }

    async hasConsent(patient: string, consumer: string): Promise<boolean> {
        return this.get("hasConsent", { patient, consumer });
    }

    async addHealthRecord(sender: string, patient: string, dataHash: string, recordType: string): Promise<any> {
        return this.post("addHealthRecord", { sender, patient, dataHash, recordType });
    }

    async getRecordCount(patient: string): Promise<number> {
        return this.get("getRecordCount", { patient });
    }

    async getHealthRecord(patient: string, index: number): Promise<any> { // returns { dataHash, timestamp, recordType }
        return this.get("getHealthRecord", { patient, index: index.toString() });
    }

    // Helper for all records at once (efficient)
    async getAllRecords(patient: string): Promise<any[]> {
        return this.get("getAllRecords", { patient });
    }

    async tip(from: string, to: string, amount: string, message: string): Promise<void> {
        return this.post("tip", { from, to, amount, message });
    }

    // --- Advanced Features ---

    async addBeneficiary(patient: string, beneficiary: string): Promise<void> {
        return this.post("addBeneficiary", { patient, beneficiary });
    }

    async getBeneficiary(patient: string): Promise<string> {
        return this.get("getBeneficiary", { patient });
    }

    async requestAccess(from: string, to: string): Promise<void> {
        return this.post("requestAccess", { from, to });
    }

    async getAccessRequests(user: string): Promise<AccessRequest[]> {
        return this.get("getAccessRequests", { user });
    }

    async respondToAccessRequest(requestId: string, status: "Approved" | "Rejected"): Promise<void> {
        return this.post("respondToAccessRequest", { requestId, status });
    }

    async createInvoice(provider: string, patient: string, amount: string, service: string): Promise<void> {
        return this.post("createInvoice", { provider, patient, amount, service });
    }

    async getInvoices(user: string): Promise<Invoice[]> {
        return this.get("getInvoices", { user });
    }

    async payInvoice(invoiceId: string): Promise<void> {
        return this.post("payInvoice", { invoiceId });
    }
}

export const blockchainClient = BlockchainClient.getInstance();

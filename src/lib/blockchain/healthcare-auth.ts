import { readData, writeData } from "./storage";
import { HealthRecord, Role, SimulationData, UserInfo, AccessRequest, Invoice } from "./types";

export class HealthcareAuthSimulator {
    private data: SimulationData;

    constructor() {
        this.data = readData();
        // Ensure new fields exist if reading from old data
        if (!this.data.beneficiaries) this.data.beneficiaries = {};
        if (!this.data.accessRequests) this.data.accessRequests = [];
        if (!this.data.accessRequests) this.data.accessRequests = [];
        if (!this.data.invoices) this.data.invoices = [];
        if (!this.data.transactions) this.data.transactions = [];
    }

    private logTransaction(action: string, from: string, to: string | undefined, data: any, status: "Success" | "Failed" = "Success") {
        const tx: any = {
            hash: "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
            from: from.toLowerCase(),
            to: to?.toLowerCase(),
            action,
            data,
            timestamp: Date.now(),
            status
        };
        if (!this.data.transactions) this.data.transactions = [];
        this.data.transactions.unshift(tx); // Newest first
    }

    private save() {
        writeData(this.data);
    }

    // --- Helpers ---
    private getUser(address: string): UserInfo {
        const normAddr = address.toLowerCase();
        return (
            this.data.users[normAddr] || {
                address: normAddr,
                role: "None",
                isRegistered: false,
            }
        );
    }

    // --- Contract Methods ---

    register(address: string, roleIndex: number) {
        const normAddr = address.toLowerCase();
        const existing = this.getUser(normAddr);

        if (existing.isRegistered) {
            throw new Error("Already registered");
        }

        const roleMap: Role[] = ["None", "Patient", "Doctor", "Admin"];
        if (roleIndex < 1 || roleIndex > 2) {
            throw new Error("Invalid role selection");
        }

        const role = roleMap[roleIndex];

        this.data.users[normAddr] = {
            address: normAddr,
            role,
            isRegistered: true,
        };
        this.save();
        this.logTransaction("Register", address, undefined, { role });
        return true;
    }

    isRegistered(address: string): boolean {
        return this.getUser(address.toLowerCase()).isRegistered;
    }

    getRole(address: string): number {
        const role = this.getUser(address.toLowerCase()).role;
        const roleMap: Role[] = ["None", "Patient", "Doctor", "Admin"];
        return roleMap.indexOf(role);
    }

    // --- Beneficiaries ---
    addBeneficiary(patient: string, beneficiary: string) {
        const pAddr = patient.toLowerCase();
        const bAddr = beneficiary.toLowerCase();

        if (this.getUser(pAddr).role !== "Patient") {
            throw new Error("Only patient can add beneficiary");
        }

        this.data.beneficiaries[pAddr] = bAddr;
        this.logTransaction("AddBeneficiary", patient, beneficiary, {});
        this.save();
    }

    getBeneficiary(patient: string): string {
        return this.data.beneficiaries[patient.toLowerCase()] || "0x0000000000000000000000000000000000000000";
    }

    // Checking if 'actor' is allowed to act on behalf of 'patient'
    isAuthorized(patient: string, actor: string): boolean {
        const pAddr = patient.toLowerCase();
        const aAddr = actor.toLowerCase();
        if (pAddr === aAddr) return true;
        return this.data.beneficiaries[pAddr] === aAddr;
    }

    // --- Access Requests ---
    requestAccess(from: string, to: string) {
        const fAddr = from.toLowerCase();
        const tAddr = to.toLowerCase();

        if (this.getUser(fAddr).role !== "Doctor") {
            throw new Error("Only doctors can request access");
        }
        if (this.getUser(tAddr).role !== "Patient") {
            throw new Error("Can only request access to patients");
        }

        const id = Math.random().toString(36).substring(7);
        this.data.accessRequests.push({
            id,
            from: fAddr,
            to: tAddr,
            status: "Pending",
            timestamp: Date.now()
        });
        this.save();
    }

    getAccessRequests(user: string): AccessRequest[] {
        const uAddr = user.toLowerCase();
        // Return requests where user is sender OR receiver
        return this.data.accessRequests.filter(r => r.from === uAddr || r.to === uAddr);
    }

    respondToAccessRequest(requestId: string, status: "Approved" | "Rejected") {
        const reqIndex = this.data.accessRequests.findIndex(r => r.id === requestId);
        if (reqIndex === -1) throw new Error("Request not found");

        const req = this.data.accessRequests[reqIndex];
        // Only the patient can respond
        // Note: In simulation we assume auth check happens before calling logic or we pass signer.
        // For simplicity, we assume caller valid validity is checked by client wrapper or just trust simulation.

        this.data.accessRequests[reqIndex].status = status;

        if (status === "Approved") {
            // Auto grant consent
            this.grantConsent(req.to, req.from);
        }

        this.save();
    }

    // --- Consent ---

    grantConsent(patient: string, consumer: string) {
        const pAddr = patient.toLowerCase();
        const cAddr = consumer.toLowerCase();

        // In simulation, we allow this call if simulation logic says so. 
        // Real contract checks msg.sender.

        if (!this.data.consent[pAddr]) {
            this.data.consent[pAddr] = {};
        }
        this.data.consent[pAddr][cAddr] = true;
        this.logTransaction("GrantConsent", patient, consumer, {});
        this.save();
    }

    revokeConsent(patient: string, consumer: string) {
        const pAddr = patient.toLowerCase();
        const cAddr = consumer.toLowerCase();

        if (this.data.consent[pAddr]) {
            this.data.consent[pAddr][cAddr] = false;
            this.logTransaction("RevokeConsent", patient, consumer, {});
            this.save();
        }
    }

    hasConsent(patient: string, consumer: string): boolean {
        const pAddr = patient.toLowerCase();
        const cAddr = consumer.toLowerCase();
        return !!(this.data.consent[pAddr] && this.data.consent[pAddr][cAddr]);
    }

    // --- Records ---

    addHealthRecord(sender: string, patient: string, dataHash: string, recordType: string) {
        const sAddr = sender.toLowerCase();
        const pAddr = patient.toLowerCase();

        // Allow if sender is patient, beneficiary, or authorized doctor
        // Simplified check:
        const senderUser = this.getUser(sAddr);
        const authorized = this.isAuthorized(pAddr, sAddr) || senderUser.role === "Doctor"; // Should strictly check consent if doctor, but sticking to previous logic + beneficiary

        if (!authorized) {
            throw new Error("Not authorized to add record");
        }

        if (!this.data.records[pAddr]) {
            this.data.records[pAddr] = [];
        }

        const record: HealthRecord = {
            dataHash,
            timestamp: Math.floor(Date.now() / 1000),
            recordType,
        };

        this.data.records[pAddr].push(record);
        this.logTransaction("AddRecord", sender, patient, { recordType, dataHash });
        this.save();
        return record;
    }

    getRecordCount(patient: string): number {
        const pAddr = patient.toLowerCase();
        return (this.data.records[pAddr] || []).length;
    }

    getHealthRecord(patient: string, index: number): HealthRecord {
        const pAddr = patient.toLowerCase();
        const records = this.data.records[pAddr] || [];
        if (index < 0 || index >= records.length) {
            throw new Error("Index out of range");
        }
        return records[index];
    }

    getAllRecords(patient: string): HealthRecord[] {
        return this.data.records[patient.toLowerCase()] || [];
    }

    // --- Invoices & Payments ---

    createInvoice(provider: string, patient: string, amount: string, service: string) {
        const id = Math.random().toString(36).substring(7);
        this.data.invoices.push({
            id,
            provider: provider.toLowerCase(),
            patient: patient.toLowerCase(),
            amount,
            service,
            status: "Pending",
            timestamp: Date.now()
        });
        this.save();
    }

    getInvoices(user: string): Invoice[] {
        const uAddr = user.toLowerCase();
        // Return invoices where user is provider OR patient (OR beneficiary? - client side filtering usually, but here checking patient field)
        return this.data.invoices.filter(i => i.provider === uAddr || i.patient === uAddr);
    }

    payInvoice(invoiceId: string) {
        const inv = this.data.invoices.find(i => i.id === invoiceId);
        if (!inv) throw new Error("Invoice not found");

        if (inv.status === "Paid") throw new Error("Already paid");

        inv.status = "Paid";
        inv.txHash = "0x" + Math.random().toString(16).substring(2); // Simulated TX Hash
        this.save();
    }

    // --- Tipping ---
    tip(from: string, to: string, amount: string, message: string) {
        const fAddr = from.toLowerCase();
        const tAddr = to.toLowerCase();

        if (!this.getUser(tAddr).isRegistered) {
            throw new Error("Recipient not registered");
        }

        this.data.tips.push({
            from: fAddr,
            to: tAddr,
            amount,
            message,
            timestamp: Date.now()
        });
        this.save();
        this.logTransaction("Tip", from, to, { amount, message });
    }

    // --- Emergency Access ---
    breakGlassAccess(doctor: string, patient: string, reason: string) {
        const dAddr = doctor.toLowerCase();
        const pAddr = patient.toLowerCase();

        if (this.getUser(dAddr).role !== "Doctor") {
            throw new Error("Only doctors can perform emergency access");
        }

        // Grant consent immediately
        if (!this.data.consent[pAddr]) {
            this.data.consent[pAddr] = {};
        }
        this.data.consent[pAddr][dAddr] = true;

        const log = {
            id: Math.random().toString(36).substring(7),
            doctor: dAddr,
            patient: pAddr,
            reason,
            timestamp: Date.now()
        };

        if (!this.data.emergencyLogs) this.data.emergencyLogs = [];
        this.data.emergencyLogs.push(log);

        this.logTransaction("EmergencyAccess", dAddr, pAddr, { reason, logId: log.id }, "Success"); // Critical status logic handled in UI
        this.save();
    }

    getTransactions(address?: string): any[] {
        if (!address) return this.data.transactions || [];
        const normAddr = address.toLowerCase();
        return (this.data.transactions || []).filter(tx =>
            tx.from === normAddr || tx.to === normAddr
        );
    }
}

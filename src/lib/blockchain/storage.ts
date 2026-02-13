import fs from "fs";
import path from "path";
import { SimulationData } from "./types";

const DATA_FILE = path.join(process.cwd(), "src/lib/blockchain/chain_data.json");

const INITIAL_DATA: SimulationData = {
    users: {},
    records: {},
    consent: {},
    tips: [],
    beneficiaries: {},
    accessRequests: [],
    invoices: [],
    emergencyLogs: [],
    transactions: []
};

// In-memory fallback for Vercel/Serverless where FS is read-only
let memoryStore: SimulationData | null = null;

// Helper to ensure file exists (only works if FS is writable)
function ensureFile() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
            fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
        }
    } catch {
        // Ignore FS errors in serverless
    }
}

export function readData(): SimulationData {
    // If we have data in memory, use it (simulation state persistence in hot lambda)
    if (memoryStore) return memoryStore;

    try {
        ensureFile();
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, "utf-8");
            memoryStore = JSON.parse(raw);
            return memoryStore!;
        }
    } catch {
        // FS failed, use initial data
    }

    // Fallback to initial data if file doesn't exist or can't be read
    if (!memoryStore) {
        memoryStore = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    return memoryStore!;
}

export function writeData(data: SimulationData) {
    memoryStore = data; // Always update memory
    try {
        ensureFile();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch {
        // Ignore FS write errors (Vercel)
        // We rely on memoryStore for the session lifetime
    }
}

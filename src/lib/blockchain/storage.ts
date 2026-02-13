import fs from "fs";
import path from "path";
import { SimulationData } from "./types";

const DATA_FILE = path.join(process.cwd(), "src/lib/simulation/chain_data.json");

const INITIAL_DATA: SimulationData = {
    users: {},
    records: {},
    consent: {},
    tips: [],
    beneficiaries: {},
    accessRequests: [],
    invoices: []
};

// Helper to ensure file exists
function ensureFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    }
}

export function readData(): SimulationData {
    ensureFile();
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to read simulation data:", error);
        return INITIAL_DATA;
    }
}

export function writeData(data: SimulationData) {
    ensureFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

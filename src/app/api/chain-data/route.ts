import { NextResponse } from "next/server";
import { readData } from "@/lib/blockchain/storage";

export async function GET() {
    try {
        const data = readData();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch chain data" }, { status: 500 });
    }
}

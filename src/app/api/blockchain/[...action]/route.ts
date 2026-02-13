import { NextRequest, NextResponse } from "next/server";
import { HealthcareAuthSimulator } from "@/lib/blockchain/healthcare-auth";

const simulator = new HealthcareAuthSimulator();

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ action: string[] }> }
) {
    const { action } = await params;
    const method = action[0];
    const body = await req.json();

    try {
        let result;
        switch (method) {
            case "register":
                result = simulator.register(body.address, body.roleIndex);
                break;
            case "isRegistered":
                result = simulator.isRegistered(body.address);
                break;
            case "getRole":
                result = simulator.getRole(body.address);
                break;
            case "grantConsent":
                result = simulator.grantConsent(body.patient, body.consumer);
                break;
            case "revokeConsent":
                result = simulator.revokeConsent(body.patient, body.consumer);
                break;
            case "hasConsent":
                result = simulator.hasConsent(body.patient, body.consumer);
                break;
            case "addHealthRecord":
                result = simulator.addHealthRecord(
                    body.sender,
                    body.patient,
                    body.dataHash,
                    body.recordType
                );
                break;
            case "getRecordCount":
                result = simulator.getRecordCount(body.patient);
                break;
            case "getHealthRecord":
                result = simulator.getHealthRecord(body.patient, body.index);
                break;
            case "getAllRecords":
                result = simulator.getAllRecords(body.patient);
                break;
            case "tip":
                result = simulator.tip(body.from, body.to, body.amount, body.message);
                break;
            // New Features
            case "addBeneficiary":
                result = simulator.addBeneficiary(body.patient, body.beneficiary);
                break;
            case "requestAccess":
                result = simulator.requestAccess(body.from, body.to);
                break;
            case "respondToAccessRequest":
                result = simulator.respondToAccessRequest(body.requestId, body.status);
                break;
            case "createInvoice":
                result = simulator.createInvoice(body.provider, body.patient, body.amount, body.service);
                break;
            case "payInvoice":
                result = simulator.payInvoice(body.invoiceId);
                break;
            case "breakGlassAccess":
                result = simulator.breakGlassAccess(body.doctor, body.patient, body.reason);
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
        return NextResponse.json({ result });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Simulation error" },
            { status: 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ action: string[] }> }
) {
    // For simplicity, we'll route everything through POST or just handle read-only here if needed.
    // But since contracts are mostly calls, we can assume the client sends necessary args in body (POST) for most things.
    // However, clean REST might prefer GET for reads. Let's support GET for simple reads with query params.

    const { action } = await params;
    const method = action[0];
    const { searchParams } = new URL(req.url);

    try {
        let result;
        switch (method) {
            case "isRegistered":
                result = simulator.isRegistered(searchParams.get("address")!);
                break;
            case "getRole":
                result = simulator.getRole(searchParams.get("address")!);
                break;
            case "hasConsent":
                result = simulator.hasConsent(searchParams.get("patient")!, searchParams.get("consumer")!);
                break;
            case "getRecordCount":
                result = simulator.getRecordCount(searchParams.get("patient")!);
                break;
            case "getAllRecords":
                result = simulator.getAllRecords(searchParams.get("patient")!);
                break;
            case "getHealthRecord":
                result = simulator.getHealthRecord(searchParams.get("patient")!, parseInt(searchParams.get("index")!));
                break;
            // New Features
            case "getBeneficiary":
                result = simulator.getBeneficiary(searchParams.get("patient")!);
                break;
            case "getAccessRequests":
                result = simulator.getAccessRequests(searchParams.get("user")!);
                break;
            case "getInvoices":
                result = simulator.getInvoices(searchParams.get("user")!);
                break;
            case "getTransactions":
                result = simulator.getTransactions(searchParams.get("address") || undefined);
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid GET action" },
                    { status: 400 }
                );
        }
        return NextResponse.json({ result });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Simulation error" },
            { status: 500 }
        );
    }
}

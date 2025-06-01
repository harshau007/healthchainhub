import PinataSDK, { PinataPinOptions } from "@pinata/sdk";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY || "",
});

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse form data." },
      { status: 400 }
    );
  }

  const patientAddressField = formData.get("patientAddress");
  const recordTypeField = formData.get("recordType");
  const fileField = formData.get("file");

  const patientAddress =
    typeof patientAddressField === "string" ? patientAddressField : "";
  const recordType = typeof recordTypeField === "string" ? recordTypeField : "";

  if (!patientAddress || !recordType || !(fileField instanceof File)) {
    return NextResponse.json(
      { error: "Missing patientAddress, recordType, or file" },
      { status: 400 }
    );
  }

  const arrayBuffer = await fileField.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const fileName = fileField.name || "upload.dat";

  let ipfsCid: string;
  try {
    const readableStream = Readable.from(fileBuffer);
    const options: PinataPinOptions = {
      pinataMetadata: { name: fileName },
      pinataOptions: { cidVersion: 1 },
    };
    const result = await pinata.pinFileToIPFS(readableStream, options);
    ipfsCid = result.IpfsHash;
  } catch (e: any) {
    console.error("Pinata error:", e);
    return NextResponse.json(
      { error: "Pinata upload failed" },
      { status: 500 }
    );
  }

  const dataHash = ethers.keccak256(ethers.toUtf8Bytes(ipfsCid));

  return NextResponse.json(
    {
      success: true,
      ipfsCid,
      dataHash,
    },
    { status: 200 }
  );
}

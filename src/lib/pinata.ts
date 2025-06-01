import PinataSDK, { PinataPinOptions } from "@pinata/sdk";

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY || "",
  process.env.PINATA_SECRET_API_KEY || ""
);

export async function pinFileToIPFS(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: fileName,
    },
    pinataOptions: {
      cidVersion: 1,
    },
  };

  const result = await pinata.pinFileToIPFS(buffer, options);
  return result.IpfsHash;
}

import { ethers } from "hardhat";

async function main(): Promise<void> {
  const HealthcareAuth = await ethers.getContractFactory("HealthcareAuth");
  const healthcareauth = await HealthcareAuth.deploy();
  await healthcareauth.deploymentTransaction()?.wait();
  const address = await healthcareauth.getAddress();
  console.log("Crowdfunding deployed to:", address);
}

main().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});

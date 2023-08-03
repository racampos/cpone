import { ethers } from "hardhat";

async function main() {
  const Cpone = await ethers.deployContract("Cpone");

  await Cpone.waitForDeployment();

  console.log("Cpone deployed to:", await Cpone.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

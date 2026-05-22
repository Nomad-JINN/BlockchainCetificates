import hre from "hardhat";

const { ethers } = await hre.network.connect();

const certificateContract = await ethers.deployContract(
  "CertificateVerification"
);

await certificateContract.waitForDeployment();

console.log(
  "CertificateVerification deployed to:",
  await certificateContract.getAddress()
);
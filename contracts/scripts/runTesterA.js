const hre = require("hardhat");
require("dotenv").config();
const { ErrorCode } = require("@ethersproject/logger");
const WORLDID_ADDR_STAGING = '0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa';


async function main() {

    const [owner, randomPerson] = await hre.ethers.getSigners();
    const worldIDTesterAContractFactory = await hre.ethers.getContractFactory('WorldIDTesterA');
    const worldIDTesterAContract = await worldIDTesterAContractFactory.deploy(WORLDID_ADDR_STAGING);
    await worldIDTesterAContract.deployed();

    console.log("Contract deployed to: ", worldIDTesterAContract.address);
    console.log("Contract deployed by: ", owner.address);
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

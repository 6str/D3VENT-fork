const hre = require("hardhat");
require("dotenv").config();
const { NETWORKS_LOOKUP, POLYGON_SCAN_STUB, MUMBAI_SCAN_STUB, VERIFY_COMMAND } = require("./constants.js")

const debug = false // extra console loggin

const constructorArgs = require('./constructorArgs');
const adminAccounts = require('./adminTestAccounts');
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers.js");
const { Signer } = require("ethers");
let networkName, networkId, srs
let worldIDTesterAContract

assignSigners = async () => srs = await hre.ethers.getSigners()
assignSigners()


const main = async () => {
  console.log("contructor args:", constructorArgs)

  try{
    const worldIDTesterAContractFactory = await hre.ethers.getContractFactory('WorldIDTesterA')
    worldIDTesterAContract = await worldIDTesterAContractFactory.deploy(...constructorArgs)
    await worldIDTesterAContract.deployed();
    console.log("Contract deployed to: ", worldIDTesterAContract.address)
  } catch (error) {
    console.log(error)
    return
  }

  const contractNetwork = await worldIDTesterAContract.provider.getNetwork()
  networkId = contractNetwork.chainId.toString()
  networkName = NETWORKS_LOOKUP.get(networkId)
  console.log("Network: %s %s", networkId, networkName )
  

  // if not Hardhat i.e. local do some pipeline actions
  if(networkId != "31337") {

  console.log(MUMBAI_SCAN_STUB + worldIDTesterAContract.address)
  console.log(POLYGON_SCAN_STUB + worldIDTesterAContract.address)
  console.log("verify command: ", VERIFY_COMMAND.replace("<REPLACE WITH CONTRACT ADDRESS>", worldIDTesterAContract.address))

/*
    // output contract address to current address quick reference file and log file
    console.log("writing contract address reference files")
    // log the deployment addresses to quick reference file
    await writeFileDeployAddr(worldIDTesterAContract.address)
    // create an export file for contract address. pipeline: imported by the frontend
    await writeExportContractAddr("../client/src/constants/contractAddress.js", worldIDTesterAContract.address)
    // create and abi file. pipeline: imported by the frontend
    await writeABI('../client/src/constants/abi.json')
*/
    // setup teammate test accounts as contract admins
    // for(const account of adminAccounts) {
    //   console.log("adding admin account: ", account)
    //   try {
    //     await worldIDTesterAContract.addAdmin(account)
    //     if(! (await worldIDTesterAContract.isAdmin(account))) {throw "couldn't verify account added: ", account}
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }
  }
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});


async function writeFileDeployAddr(contractAddress) {
  const fs = require('fs');
  let isoTime = new Date(Date.now()).toISOString().replace("T"," ").slice(0,19)
  let content = isoTime + "\t" + contractAddress + '\t' + networkName + '\t' + networkId + "\n"
  console.log(content)
  
  // just the current/latest one
  fs.writeFileSync('./deployAddress.txt', content, err => {
    if (err) { console.error(err) }
  })

  // keep a history
  fs.appendFileSync('./deployAddressesLog.txt', content, err => {
    if (err) { console.error(err) }
  })
}

async function writeExportContractAddr(outFilepath, contractAddress) {
  const fs = require('fs');
  const content = "const addressofContract = '" + contractAddress +"'\nexport default addressofContract;"

  console.log(outFilepath)
  console.log(content)
  fs.writeFileSync(outFilepath, content, err => {
    if (err) {
      console.error(err)
    }
  })
}

// pipeline: take the abi out of the contract artifacts file and create
// an abi.json file and create an abi file for the front end to import
async function writeABI (outFilepath) {
  const inFilePath = './artifacts/contracts/d3vent.sol/d3vent.json'

  const fs = require('fs');
  const contractArtifacts = fs.readFileSync(inFilePath, 'utf8');
  const abi = JSON.parse(contractArtifacts).abi;
  fs.writeFileSync(outFilepath, JSON.stringify(abi, null, 2), err => {
    if (err) {
      console.error(err)
    }
  })
  if(debug){console.log(abi)}
}
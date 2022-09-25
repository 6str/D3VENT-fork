const { expect } = require("chai")
const { ethers } = require("hardhat")
// const {
//   getProof,
//   getRoot,
//   prepareWorldID,
//   registerIdentity,
//   registerInvalidIdentity,
//   setUpWorldID,
// } = require ('./helpers/InteractsWithWorldID.ts')

const constructorArgs = require('../scripts/constructorArgs');
const addrZero = ethers.constants.AddressZero




describe("Deploy contract", function () {
  let srs, d3vent, d3ventContractFactory

  assignSigners = async () => srs = await hre.ethers.getSigners()
  assignSigners()

  beforeEach('deploy contract', async function () {
    d3ventContractFactory = await ethers.getContractFactory("d3vent")
  })


  it("Should deploy passing valid constructor args", async function () {
    d3vent = await d3ventContractFactory.deploy(...constructorArgs)

    console.log(await d3vent.getExtNullifierHash())
    await expect(d3vent.deployed()).not.to.be.reverted
    expect(d3vent.address).to.be.properAddress
    expect(d3vent.address).not.to.equal(addrZero)
  })

  // fail tests
  it("Should fail to deploy. Passing invalid worldId address", async function () {
    await expect(d3ventContractFactory.deploy(addrZero)).to.be.revertedWith('zero address is invalid')
    await expect(d3ventContractFactory.deploy()).to.be.reverted
    await expect(d3ventContractFactory.deploy(1)).to.be.reverted
    await expect(d3ventContractFactory.deploy("not valid")).to.be.reverted
  })
})

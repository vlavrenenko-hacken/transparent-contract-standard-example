import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import { TokenV1__factory, TokenV2__factory } from "../typechain-types";

describe("TransparentProxy Test", function () {
  let TokenV1:TokenV1__factory;
  let TokenV2: TokenV2__factory;
  let signers:SignerWithAddress[];
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySetupFixture() {
    TokenV1 = await ethers.getContractFactory("TokenV1");
    TokenV2 = await ethers.getContractFactory("TokenV2");
    signers = await ethers.getSigners();
    return {TokenV1, TokenV2};
  }

  it("Test transparent proxy", async function () {
    const {TokenV1, TokenV2} = await loadFixture(deploySetupFixture);
    const proxyv1 = await hre.upgrades.deployProxy(TokenV1, {initializer: "initialize", kind:"transparent"});
    expect(await proxyv1.name()).to.eq("TokenV1");
    
    // upgrade to the second version{call: "pauseInit", kind: "transparent" }
    const proxyv2 = await hre.upgrades.upgradeProxy(proxyv1, TokenV2, {call:"pauseInit", kind:"transparent"});
    
    // pause the contract
    await proxyv2.pause();
    await expect(proxyv2.mint(signers[1].address, ethers.utils.parseEther("1"))).to.be.revertedWith("Pausable: paused");
  })
});

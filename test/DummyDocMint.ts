import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Dummy DOC Mint Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDummyERC20() {
    //const ONE_GWEI = 1_000_000_000;
    const initBtcPrice = 23000;// * ONE_GWEI; //in gwei-DOCs
    const initFee =  1;//ONE_GWEI;

    // Contracts are deployed using the first signer/account by default
    // brew: see use of `connect` to call with otherAccount
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("DummyDocMint");
    const erc20 = await ERC20.deploy(owner.address, initFee , initBtcPrice, { value: 0 });

    return {erc20, initFee , initBtcPrice, owner, otherAccount};
  }

    describe("Deployment", function () {
        it("Should set the right owner address", async function () {
            const { erc20, initFee , initBtcPrice, owner, otherAccount } = await loadFixture(deployDummyERC20);
      
            expect(await erc20.owner()).to.equal(owner.address);
        });
      
        it("Should set the  correct fee", async function () {
              const { erc20, initFee , initBtcPrice, owner, otherAccount } = await loadFixture(deployDummyERC20);
        
              expect(await erc20.fee()).to.equal(initFee);
        });
      
        it("Should set the correct BTC price", async function () {
              const { erc20, initFee , initBtcPrice, owner, otherAccount } = await loadFixture(deployDummyERC20);
        
              expect(await erc20.btcPrice()).to.equal(initBtcPrice);
        });
            
        it("Should set the correct initial token supply (zero)", async function () {
              const { erc20, initFee , initBtcPrice, owner, otherAccount } = await loadFixture(deployDummyERC20);
        
              expect(await erc20.totalSupply()).to.equal(0);
        });
      
        it("Should set the correct token symbol", async function () {
              const { erc20, initFee , initBtcPrice, owner, otherAccount } = await loadFixture(deployDummyERC20);
        
              expect(await erc20.symbol()).to.equal('DDOC');
        });
      
    });

    describe("Set Params", function () {
        it("Should revert reset price by other accounts", async function () {
            const { erc20, initBtcPrice, otherAccount} = await loadFixture(deployDummyERC20);
            await expect(erc20.connect(otherAccount).setBtcPrice( initBtcPrice*2)).to.be.revertedWith(
            "Only owner can reset price"
           );
        });
        
        it("Should revert reset fee by other accounts", async function () {
            const { erc20, initFee, otherAccount} = await loadFixture(deployDummyERC20);
            await expect(erc20.connect(otherAccount).setMintFee(initFee*3)).to.be.revertedWith(
            "Only owner can reset fee"
           );
        });

        it("Should reset BTC price correctly by owner", async function () {
            const { erc20, initBtcPrice} = await loadFixture(deployDummyERC20);
            await erc20.setBtcPrice( initBtcPrice*3);
            expect(await erc20.btcPrice()).to.equal(initBtcPrice*3);
        });
        
        it("Should reset fee correctly by owner", async function () {
            const { erc20, initFee} = await loadFixture(deployDummyERC20);
            await erc20.setMintFee( initFee*3);
            expect(await erc20.fee()).to.equal(initFee*3);
        });
    });

    describe("Mint DOCs", function () {
        it("Should mint Docs", async function () {
            const {erc20, initBtcPrice, initFee, owner} = await loadFixture(deployDummyERC20);
            let val = 4;
            let toMint = 2;
            await erc20.mintDoc(toMint, {value: val});
            let minted = initBtcPrice * toMint;
            expect(await erc20.balanceOf(owner.address)).to.equal(minted); 
        })
    });

});
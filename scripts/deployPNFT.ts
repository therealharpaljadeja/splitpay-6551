import { ethers } from "hardhat";

// "scroll-sepolia": "0xaC45c833E270300167b94DB759A21eAAE7eF5C78",
//     mantle: "0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6",
//     maticmum: "0x2c8bf7Bd8bfbF6227DedD12cDe5f2AB3d60bA1B4",
async function mint() {
    let [deployer] = await ethers.getSigners();
    let apeNFT = await ethers.getContractAt("PNFT", "");
    await apeNFT.mint(deployer.address);
}

async function getNFTs() {
    let [deployer] = await ethers.getSigners();
    let pNFT = await ethers.getContractAt("PNFT", "");

    let balance = await pNFT.balanceOf(deployer.address);
    for (let i = 0; i < balance; i++)
        console.log(await pNFT.tokenOfOwnerByIndex(deployer.address, i));
}

async function main() {
    // await mint();
    // await getNFTs();
    let PNFT = await ethers.getContractFactory("PNFT");
    let pNFT = await PNFT.deploy("pNFT", "pNFT");
    console.log(`pNFT: ${pNFT.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

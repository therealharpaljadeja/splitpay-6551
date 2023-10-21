import { ethers } from "hardhat";

// Scroll: "0xaC45c833E270300167b94DB759A21eAAE7eF5C78",
// Mantle: "0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6",
// Mumbai: "0x2c8bf7Bd8bfbF6227DedD12cDe5f2AB3d60bA1B4",
async function mint(address: string) {
    let [deployer] = await ethers.getSigners();
    let apeNFT = await ethers.getContractAt("PNFT", address);
    await apeNFT.mint(deployer.address);
}

async function getNFTs(address: string) {
    let [deployer] = await ethers.getSigners();
    let pNFT = await ethers.getContractAt("PNFT", address);

    let balance = await pNFT.balanceOf(deployer.address);
    for (let i = 0; i < Number(balance); i++)
        console.log(await pNFT.tokenOfOwnerByIndex(deployer.address, i));
}

async function main() {
    let PNFT = await ethers.getContractFactory("PNFT");
    let pNFT = await PNFT.deploy("pNFT", "pNFT");
    console.log(`pNFT: ${pNFT.address}`);
    await mint(pNFT.address);
    await getNFTs(pNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

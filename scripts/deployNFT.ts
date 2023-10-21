import { ethers } from "hardhat";

// Scroll: 0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5
// Mantle: 0x4C8AFaE32F6A3ea0B8bcF60FA23402D8E4099e99
// Mumbai: 0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6

async function mint(address: string) {
    let [deployer] = await ethers.getSigners();
    let apeNFT = await ethers.getContractAt("ApeNFT", address);
    await apeNFT.mint(deployer.address);
}

async function getNFTs(address: string) {
    let [deployer] = await ethers.getSigners();
    let apeNFT = await ethers.getContractAt(
        "ApeNFT",
        "0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5"
    );

    let balance = await apeNFT.balanceOf(deployer.address);
    for (let i = 0; i < balance; i++)
        console.log(await apeNFT.tokenOfOwnerByIndex(deployer.address, i));
}

async function main() {
    let ApeNFT = await ethers.getContractFactory("ApeNFT");
    let apeNFT = await ApeNFT.deploy("ApeNFT", "ANFT");
    console.log(`ApeNFT: ${apeNFT.address}`);
    await mint(apeNFT.address);
    await getNFTs(apeNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

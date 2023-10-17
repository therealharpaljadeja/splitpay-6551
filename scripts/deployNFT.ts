import { ethers } from "hardhat";

// Scroll: 0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5
// Mantle: 0x3E2375eEa603f750be14273F695d1E687379eD55
// Mumbai: 0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6

async function mint() {
    let [deployer] = await ethers.getSigners();
    let apeNFT = await ethers.getContractAt(
        "ApeNFT",
        "0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5"
    );
    await apeNFT.mint(deployer.address);
}

async function getNFTs() {
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
    // await mint();
    // await getNFTs();
    // let ApeNFT = await ethers.getContractFactory("ApeNFT");
    // let apeNFT = await ApeNFT.deploy("ApeNFT", "ANFT");
    // console.log(`ApeNFT: ${apeNFT.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

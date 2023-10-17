import { ethers } from "hardhat";

// Scroll = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF
// Mantle = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF
// Mumbai = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF

async function mint() {
    let [deployer] = await ethers.getSigners();
    let mockErc20 = await ethers.getContractAt(
        "MockERC20",
        "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF"
    );

    await mockErc20.mint(
        "0x0e9384235229808f4BFD4d411Cc279C5cD2eF24A",
        ethers.utils.parseEther("10")
    );
}

async function main() {
    // let MockERC20 = await ethers.getContractFactory("MockERC20");
    // let mockErc20 = await MockERC20.deploy("ApeCoin", "APE");

    mint();
    // console.log(`MockERC20: ${mockErc20.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

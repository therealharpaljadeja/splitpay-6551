import { ethers } from "hardhat";

// Scroll = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF
// Mantle = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF
// Mumbai = 0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF

async function mint(address: string) {
    let [deployer] = await ethers.getSigners();
    let mockErc20 = await ethers.getContractAt("MockERC20", address);

    await mockErc20.mint(deployer.address, ethers.utils.parseEther("2"));
}

async function main() {
    let MockERC20 = await ethers.getContractFactory("MockERC20");
    let mockErc20 = await MockERC20.deploy("ApeCoin", "APE");
    console.log(`MockERC20: ${mockErc20.address}`);

    await mint(mockErc20.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

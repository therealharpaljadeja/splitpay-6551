import { ethers } from "hardhat";

// Scroll: 0x5BD110776F5fF4aF16838C68C4DB711320852897
// Mantle: 0xB5e112494224096957AfA2d176f00F33c596Cf56
// Mumbai: 0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb

async function main() {
    let Implementation = await ethers.getContractFactory(
        "SimpleERC6551Account"
    );
    let implementation = await Implementation.deploy();
    console.log(`SimpleERC6551Account: ${implementation.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

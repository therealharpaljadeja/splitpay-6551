import { ethers } from "hardhat";

// Scroll: 0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb
// Mantle: 0x5e42ba8188a68BB96a85b712F590f769fDBC1fE9
// Mumbai: 0x5BD110776F5fF4aF16838C68C4DB711320852897

async function main() {
    let Registry = await ethers.getContractFactory("ERC6551Registry");
    let registry = await Registry.deploy();
    console.log(`Registry: ${registry.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

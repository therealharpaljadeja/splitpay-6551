import { ethers } from "hardhat";
import { parseEther } from "viem";

// Scroll: "0xec6cF839755522D60641E15C69caC507550d3151",
// Mantle: "0x6936D312C8b06d4b7EA879aEf32c2eE9E23B1305",
// Mumbai: "0xFeE84A8b5ed258D61B457418f5F9C1c066906901",

async function createProduct() {
    let product = await ethers.getContractAt(
        "Products",
        "0x6936D312C8b06d4b7EA879aEf32c2eE9E23B1305"
    );

    await product.createProducts(
        "Handbag",
        parseEther("4"),
        "0x22e4aFF96b5200F2789033d85fCa9F58f163E9Ea",
        "https://m.media-amazon.com/images/I/61mAz8T51kL._AC_UY1000_.jpg"
    );

    await product.createProducts(
        "PS5",
        parseEther("100"),
        "0x22e4aFF96b5200F2789033d85fCa9F58f163E9Ea",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Black_and_white_Playstation_5_base_edition_with_controller.png/800px-Black_and_white_Playstation_5_base_edition_with_controller.png"
    );

    await product.createProducts(
        "Meta Quest 3",
        parseEther("10"),
        "0x22e4aFF96b5200F2789033d85fCa9F58f163E9Ea",
        "https://unboundxr.eu/media/catalog/product/cache/14/thumbnail/600x600/e4d92e6aceaad517e7b5c12e0dc06587/q/u/quest-3-1_1.png"
    );
}

async function main() {
    let Products = await ethers.getContractFactory("Products");
    let products = await Products.deploy("https://www.google.com");

    await products.deployed();

    console.log(`Products: ${products.address}`);
    createProduct();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

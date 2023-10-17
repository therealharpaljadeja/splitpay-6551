import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        scrollTestnet: {
            url: "https://scroll-public.scroll-testnet.quiknode.pro",
            accounts: [process.env.PRIVATE_KEY!],
        },
        mantleTestnet: {
            url: "https://rpc.testnet.mantle.xyz",
            accounts: [process.env.PRIVATE_KEY!],
        },
        mumbai: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: [process.env.PRIVATE_KEY!],
        },
    },
    etherscan: {
        apiKey: {
            scrollTestnet: "4ZZ95EJJX9U2KVV243DA7MU2JPZN2YR143",
            polygonMumbai: "62MNZWZMP1ZZV3ZRFF4Z3FAH8II41HR2TH",
        },
        customChains: [
            {
                network: "scrollTestnet",
                chainId: 534351,
                urls: {
                    apiURL: "https://api-sepolia.scrollscan.dev/api",
                    browserURL: "https://sepolia.scrollscan.dev/",
                },
            },
        ],
    },
};

export default config;

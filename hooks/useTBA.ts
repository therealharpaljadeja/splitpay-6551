import { encodeFunctionData, formatEther, getContract, parseEther } from "viem";
import {
    useAccount,
    useNetwork,
    usePublicClient,
    useWalletClient,
} from "wagmi";
import NFTAbi from "../abi/NFT";
import ApeCoinAbi from "../abi/ApeCoin";
import AccountAbi from "../abi/SimpleERC6551Account";
import erc6551RegistryAbi from "../abi/ERC6551Registry";
import PNFTAbi from "../abi/PNFT";

export type NFT = {
    tokenId: Number;
    tokenUri: string;
};

export type Account = {
    address: string;
    tokenId: Number;
    tokenURI: string;
    apeCoinBalance: Number;
    isDeployed: boolean;
};

export const REGISTRY = {
    maticmum: "0x5BD110776F5fF4aF16838C68C4DB711320852897",
    "scroll-sepolia": "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
    mantle: "0x5e42ba8188a68BB96a85b712F590f769fDBC1fE9",
};

export const IMPLEMENTATION = {
    maticmum: "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
    "scroll-sepolia": "0x5BD110776F5fF4aF16838C68C4DB711320852897",
    mantle: "0xB5e112494224096957AfA2d176f00F33c596Cf56",
};

export const NFT = {
    maticmum: "0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6",
    "scroll-sepolia": "0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5",
    mantle: "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
};

export const APECOIN = {
    "scroll-sepolia": "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
    mantle: "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
    maticmum: "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
};

export const PNFT = {
    "scroll-sepolia": "0xaC45c833E270300167b94DB759A21eAAE7eF5C78",
    mantle: "0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6",
    maticmum: "0x2c8bf7Bd8bfbF6227DedD12cDe5f2AB3d60bA1B4",
};

export default function useTBA() {
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { chain } = useNetwork();

    async function getAccounts(nfts: NFT[]): Promise<Account[]> {
        let accounts: Account[] = [];
        for (let i = 0; i < nfts?.length; i++) {
            let account: Account = {
                tokenId: 0,
                tokenURI: "",
                apeCoinBalance: 0,
                address: "",
                isDeployed: false,
            };
            account["address"] = (await getAccount(
                NFT[chain?.network],
                Number(nfts[i].tokenId)
            )) as string;
            account["tokenId"] = Number(nfts[i]["tokenId"].toString());
            account["tokenURI"] = nfts[i]["tokenUri"];

            account["apeCoinBalance"] = Number(
                await getTokenBalance(account["address"])
            );

            account["isDeployed"] = (await publicClient.getBytecode({
                address: account["address"],
            }))
                ? true
                : false;

            accounts.push(account);
        }
        return accounts;
    }

    async function getNFTs(): Promise<NFT[]> {
        if (publicClient) {
            let nft = getContract({
                address: NFT[chain?.network],
                abi: NFTAbi,
                publicClient,
            });

            let balance = Number(await nft.read.balanceOf([address]));
            let result = [];
            for (let i = 0; i < balance; i++) {
                let token: NFT = {
                    tokenId: 0,
                    tokenUri: "",
                };
                token["tokenId"] = (await nft.read.tokenOfOwnerByIndex([
                    address,
                    i,
                ])) as Number;
                token["tokenUri"] = (await nft.read.tokenURI([
                    Number(token["tokenId"]),
                ])) as string;
                result.push(token);
            }

            return result;
        } else {
            return [];
        }
    }

    async function createAccount(tokenContract: string, tokenId: number) {
        if (walletClient) {
            let registry = getContract({
                address: REGISTRY[chain?.network],
                abi: erc6551RegistryAbi,
                walletClient,
            });

            return await registry.write.createAccount([
                IMPLEMENTATION[chain?.network],
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                chain?.id,
                tokenContract,
                tokenId,
            ]);
        }
    }

    async function transferTokens(from: string, to: string, amount: string) {
        if (walletClient) {
            let transferAmount = parseEther(amount);
            let calldata = encodeFunctionData({
                abi: ApeCoinAbi,
                functionName: "transfer",
                args: [to, transferAmount],
            });
            let hash = await walletClient.sendTransaction({
                chain,
                to: from,
                data: encodeFunctionData({
                    abi: AccountAbi,
                    functionName: "execute",
                    args: [APECOIN[chain?.network], 0, calldata, 0],
                }),
            });
            console.log(hash);
        }
    }

    async function getTokenBalance(address: string): Promise<string> {
        if (publicClient) {
            let apeCoin = getContract({
                address: APECOIN[chain?.network],
                abi: ApeCoinAbi,
                publicClient,
            });

            return formatEther(
                (await apeCoin.read.balanceOf([address])).toString()
            );
        }
        return "";
    }

    async function getAccount(tokenContract: string, tokenId: number) {
        if (publicClient) {
            let registry = getContract({
                address: REGISTRY[chain.network],
                abi: erc6551RegistryAbi,
                publicClient,
            });

            return await registry.read.account([
                IMPLEMENTATION[chain?.network],
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                chain?.id,
                tokenContract,
                tokenId,
            ]);
        }
    }

    async function mintPNFT() {
        let hash = await walletClient?.sendTransaction({
            to: PNFT[chain?.network],
            data: encodeFunctionData({
                abi: PNFTAbi,
                args: [address],
                functionName: "mint",
            }),
        });

        let pNFT = getContract({
            address: PNFT[chain?.network],
            abi: PNFTAbi,
            publicClient,
        });

        return await pNFT.read.tokenId();
    }

    async function transferPNFT(to: string, tokenId: Number) {
        await walletClient?.sendTransaction({
            to: PNFT[chain?.network],
            data: encodeFunctionData({
                abi: PNFTAbi,
                functionName: "transferFrom",
                args: [address, to, tokenId],
            }),
        });
    }

    return {
        getAccounts,
        getNFTs,
        createAccount,
        transferTokens,
        getTokenBalance,
        getAccount,
        mintPNFT,
        transferPNFT,
        chain,
    };
}

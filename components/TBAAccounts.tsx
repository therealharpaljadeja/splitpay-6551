import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Tag,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { encodeFunctionData, formatEther, getContract, parseEther } from "viem";
import {
    useAccount,
    useNetwork,
    usePublicClient,
    useWalletClient,
} from "wagmi";
import erc6551RegistryAbi from "../abi/ERC6551Registry";
import NFTAbi from "../abi/NFT";
import ApeCoinAbi from "../abi/ApeCoin";
import AccountAbi from "../abi/SimpleERC6551Account";

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

const REGISTRY = {
    maticmum: "0x5BD110776F5fF4aF16838C68C4DB711320852897",
    "scroll-sepolia": "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
    mantle: "0x5e42ba8188a68BB96a85b712F590f769fDBC1fE9",
};

const IMPLEMENTATION = {
    maticmum: "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
    "scroll-sepolia": "0x5BD110776F5fF4aF16838C68C4DB711320852897",
    mantle: "0xB5e112494224096957AfA2d176f00F33c596Cf56",
};

const NFT = {
    maticmum: "0xd45A1D84d62AA0976618a3B7c56D96ff0A2389c6",
    "scroll-sepolia": "0xC323b2Dbddc165e028de78eb5Ca43a9072d037f5",
    mantle: "0xF9dCbF5a1C021F56F04B2767f2707d36ECA10bbb",
};

const APECOIN = {
    "scroll-sepolia": "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
    mantle: "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
    maticmum: "0x070d4A2BCe5b31b4aC0687B5D11177d89090A5fF",
};

export default function TBAAccounts({ contributions, setContributions }) {
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { chain } = useNetwork();
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        (async () => {
            if (walletClient) {
                let nfts = await getNFTs();
                await getAccounts(nfts);
            }
        })();

        return () => {
            setAccounts([]);
        };
    }, [walletClient]);

    // useEffect(() => {
    //     (async () => {
    //         if (walletClient) {
    //             await transferTokens(
    //                 "0x0e9384235229808f4BFD4d411Cc279C5cD2eF24A",
    //                 "0xD8904c8207D23d835d4E8137831D941849010641",
    //                 "1"
    //             );
    //         }
    //     })();
    // }, [walletClient]);

    async function getAccounts(nfts: NFT[]) {
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
        setAccounts([...accounts]);
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

    async function createAccount(tokenId: number) {
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
                NFT[chain?.network],
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

    async function getAccount(tokenId: number) {
        if (publicClient) {
            let registry = getContract({
                address: REGISTRY[chain?.network],
                abi: erc6551RegistryAbi,
                publicClient,
            });

            return await registry.read.account([
                IMPLEMENTATION[chain?.network],
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                chain?.id,
                NFT[chain?.network],
                tokenId,
            ]);
        }
    }

    function handleChange(address: string, value: unknown) {
        setContributions({ ...contributions, [address]: value });
    }

    return (
        <VStack width={"100%"} alignItems={"start"} gap={"5"}>
            <Heading size={"md"}>Your TBAs</Heading>
            <VStack width={"100%"} alignItems={"start"}>
                {accounts &&
                    accounts.map((account: Account) => (
                        <HStack
                            border="1px solid #ccc"
                            borderRadius={"10px"}
                            alignItems={"start"}
                            padding={"2"}
                            // width={"100%"}
                        >
                            <Image
                                width={"70px"}
                                height={"70px"}
                                borderRadius={"10px"}
                                src={account.tokenURI}
                            />
                            <VStack alignItems={"start"}>
                                <Text fontWeight={"bold"}>
                                    ApeNFT #{account.tokenId.toString()}
                                </Text>
                                <Tag>
                                    <Link
                                        href={`${chain?.blockExplorers?.default.url}/address/${account.address}`}
                                        target="_blank"
                                    >
                                        {`${account.address} `}
                                        <ExternalLinkIcon />
                                    </Link>
                                </Tag>
                                <Text>
                                    {account.apeCoinBalance.toString()} APE
                                </Text>
                            </VStack>
                            <Divider width={"10px"} orientation="vertical" />
                            <VStack alignItems={"start"}>
                                {account.isDeployed ? (
                                    <>
                                        <Text>Contribution</Text>
                                        <InputGroup>
                                            <Input
                                                isDisabled={!account.isDeployed}
                                                width={"100px"}
                                                isInvalid={
                                                    contributions[
                                                        account.address
                                                    ] > account.apeCoinBalance
                                                }
                                                onChange={({ target }) =>
                                                    handleChange(
                                                        account.address,
                                                        target.value
                                                    )
                                                }
                                            />
                                            <InputRightAddon children="APE" />
                                        </InputGroup>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            createAccount(account.tokenId)
                                        }
                                    >
                                        Deploy Account
                                    </Button>
                                )}
                            </VStack>
                        </HStack>
                    ))}
            </VStack>
        </VStack>
    );
}

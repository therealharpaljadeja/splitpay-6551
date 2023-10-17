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
import useTBA, { Account } from "../hooks/useTBA";

export default function TBAAccounts({ contributions, setContributions }) {
    const { data: walletClient } = useWalletClient();
    const { getNFTs, getAccounts } = useTBA();
    const { chain } = useNetwork();
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        (async () => {
            if (walletClient) {
                let nfts = await getNFTs();
                let accounts = await getAccounts(nfts);
                setAccounts(accounts);
            }
        })();

        return () => {
            setAccounts([]);
        };
    }, [walletClient]);

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
                            key={account.address}
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

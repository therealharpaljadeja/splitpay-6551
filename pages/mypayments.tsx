// @ts-nocheck
import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Link,
    Skeleton,
    Tag,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import useTBA, { Account, PNFT } from "../hooks/useTBA";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

const Buy: NextPage = () => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);
    const { address, isConnected } = useAccount();
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const { getPNFTs, createAccount, chain, transferTokens } = useTBA();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isConnected) {
            (async () => {
                setIsLoading(true);
                let accounts = await getPNFTs(address);
                setAccounts(accounts);
                setIsLoading(false);
            })();
        }
    }, [isConnected, address]);

    async function withdraw() {
        if (accounts) {
            for await (const account of accounts) {
                let transferToast = toast({
                    title: "Transferring tokens to your accounts",
                    variant: "left-accent",
                    duration: 60000,
                    position: "bottom",
                    status: "loading",
                });

                try {
                    await transferTokens(
                        account.address,
                        address,
                        account.apeCoinBalance.toString()
                    );

                    toast.update(transferToast, {
                        title: "Tokens transferred to Payment TBA",
                        status: "success",
                    });
                } catch (error) {
                    toast.update(transferToast, {
                        title: "Something went wrong",
                        status: "error",
                    });
                }
            }
        }
    }

    if (!isClient) {
        return null;
    }

    if (!isConnected) {
        return <Text>Please Connect Wallet</Text>;
    }

    return (
        <HStack
            width={"100%"}
            alignItems={"start"}
            justifyContent={"space-between"}
        >
            <VStack width={"100%"} alignItems={"start"} gap={"5"}>
                <Heading size={"md"}>Your TBAs</Heading>
                {isLoading ? (
                    <VStack width={"100%"} alignItems={"start"}>
                        <HStack borderRadius={"10px"} alignItems={"start"}>
                            <Skeleton
                                height={"70px"}
                                width={"70px"}
                                isLoaded={!isLoading}
                            >
                                <Box width={"70px"} height={"70px"}></Box>
                            </Skeleton>
                            <VStack alignItems={"start"}>
                                <Skeleton width={"280px"} height={"20px"} />
                                <Skeleton width={"140px"} height={"20px"} />
                            </VStack>
                        </HStack>
                    </VStack>
                ) : (
                    <>
                        {accounts && accounts.length > 0 ? (
                            <VStack width={"100%"} alignItems={"start"}>
                                {accounts.map((account: Account) => {
                                    if (account.apeCoinBalance) {
                                        return (
                                            <HStack
                                                border="1px solid #ccc"
                                                borderRadius={"10px"}
                                                alignItems={"start"}
                                                padding={"2"}
                                                key={account.address}
                                            >
                                                <VStack alignItems={"start"}>
                                                    <Text fontWeight={"bold"}>
                                                        PNFT #
                                                        {account.tokenId.toString()}
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
                                                        {account.apeCoinBalance.toString()}{" "}
                                                        APE
                                                    </Text>
                                                </VStack>
                                                <Divider
                                                    width={"10px"}
                                                    orientation="vertical"
                                                />
                                                <VStack alignItems={"start"}>
                                                    {account.isDeployed ? null : (
                                                        <Button
                                                            onClick={() =>
                                                                createAccount(
                                                                    PNFT[
                                                                        chain
                                                                            ?.network
                                                                    ],
                                                                    Number(
                                                                        account.tokenId
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Deploy Account
                                                        </Button>
                                                    )}
                                                </VStack>
                                            </HStack>
                                        );
                                    }
                                })}
                                <Button
                                    onClick={withdraw}
                                    isDisabled={accounts?.length <= 0}
                                >
                                    Withdraw
                                </Button>
                            </VStack>
                        ) : (
                            <Text>Nothing to Withdraw</Text>
                        )}
                    </>
                )}
            </VStack>
        </HStack>
    );
};

export default Buy;

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Box,
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
    Toast,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNetwork, useWalletClient } from "wagmi";
import useTBA, { Account, NFT } from "../hooks/useTBA";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function TBAAccounts({ contributions, setContributions }) {
    const { data: walletClient } = useWalletClient();
    const toast = useToast();
    const { getNFTs, getAccounts, createAccount } = useTBA();
    const { chain } = useNetwork();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (walletClient) {
                setIsLoading(true);
                let nfts = await getNFTs();
                let accounts = await getAccounts(nfts);
                setAccounts(accounts);
                setIsLoading(false);
            }
        })();

        return () => {
            setAccounts([]);
        };
    }, [walletClient]);

    function handleChange(address: string, value: unknown) {
        setContributions({ ...contributions, [address]: value });
    }

    async function deployAccount(tokenId) {
        let createAccountToast = toast({
            title: "Deploying TBA",
            variant: "left-accent",
            duration: 60000,
            position: "bottom",
            status: "loading",
        });

        try {
            await createAccount(NFT[chain?.network], Number(tokenId));

            toast.update(createAccountToast, {
                title: "Tokens transferred to Payment TBA",
                status: "success",
            });
        } catch (error) {
            toast.update(createAccountToast, {
                title: "Something went wrong",
                status: "error",
            });
        }
    }

    return (
        <VStack width={"100%"} alignItems={"start"} gap={"5"}>
            <Heading size={"md"}>Your TBAs</Heading>
            <VStack width={"100%"} alignItems={"start"}>
                {isLoading ? (
                    <>
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
                    </>
                ) : (
                    <>
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
                                            {account.apeCoinBalance.toString()}{" "}
                                            APE
                                        </Text>
                                    </VStack>
                                    <Divider
                                        width={"10px"}
                                        orientation="vertical"
                                    />
                                    <VStack alignItems={"start"}>
                                        {account.isDeployed ? (
                                            <>
                                                <Text>Contribution</Text>
                                                <InputGroup>
                                                    <Input
                                                        isDisabled={
                                                            !account.isDeployed
                                                        }
                                                        width={"100px"}
                                                        isInvalid={
                                                            contributions[
                                                                account.address
                                                            ] >
                                                            account.apeCoinBalance
                                                        }
                                                        onChange={({
                                                            target,
                                                        }) =>
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
                                                colorScheme="blue"
                                                onClick={() =>
                                                    deployAccount(
                                                        account.tokenId
                                                    )
                                                }
                                            >
                                                Deploy Account
                                            </Button>
                                        )}
                                    </VStack>
                                </HStack>
                            ))}
                    </>
                )}
            </VStack>
        </VStack>
    );
}

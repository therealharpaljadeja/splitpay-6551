import {
    Button,
    HStack,
    Image,
    Progress,
    Text,
    VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Product } from "..";
import { useRouter } from "next/router";

import TBAAccounts from "../../components/TBAAccounts";
import useTBA, { PNFT } from "../../hooks/useTBA";
import { useAccount } from "wagmi";
import { useToast } from "@chakra-ui/react";

const Buy: NextPage = () => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const [isClient, setIsClient] = useState(false);

    const toast = useToast();

    const {
        mintPNFT,
        chain,
        getAccount,
        transferTokens,
        createAccount,
        transferPNFT,
        getProduct,
    } = useTBA();

    const [contributions, setContributions] = useState({});
    const [totalContribution, setTotalContribution] = useState(0);
    const [progress, setProgress] = useState(0);

    const [product, setProduct] = useState<Product>();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        (async () => {
            if (router.query.id) {
                let result = await getProduct(router.query.id);
                setProduct(result);
            }
        })();

        return () => {
            setProduct(undefined);
        };
    }, [router.query]);

    useEffect(() => {
        if (product) {
            let totalContribution = 0;
            Object.values(contributions).forEach(
                (value) => (totalContribution += Number(value))
            );
            setTotalContribution(totalContribution);
            setProgress((totalContribution * 100) / product.price);
        }
    }, [contributions]);

    async function pay() {
        if (product) {
            // Mint PNFT
            let nft = await mintPNFT();

            let tokenId = Number(nft);

            // // Address to transfer assets to
            let accountAddress = await getAccount(
                PNFT[chain?.network],
                tokenId
            );

            // // Transfer tokens
            for (const contribution of Object.keys(contributions)) {
                if (
                    contributions[contribution] &&
                    contributions[contribution] > 0
                ) {
                    let toastId = toast({
                        title: "Transferring tokens to payment TBA",
                        variant: "left-accent",
                        duration: 60000,
                        position: "bottom",
                        status: "loading",
                    });

                    try {
                        await transferTokens(
                            contribution,
                            accountAddress,
                            contributions[contribution]
                        );

                        toast.update(toastId, {
                            title: "Tokens transferred to Payment TBA",
                            status: "success",
                        });
                    } catch (error) {
                        toast.update(toastId, {
                            title: "Something went wrong",
                            status: "error",
                        });
                    }
                }
            }

            let createAccountToast = toast({
                title: "Creating Payment TBA",
                position: "bottom",
                variant: "left-accent",
                status: "loading",
                duration: 60000,
            });

            try {
                // // Deploy Account

                await createAccount(PNFT[chain.network], tokenId);

                toast.update(createAccountToast, {
                    status: "success",
                    title: "PNFT TBA Created",
                    isClosable: true,
                    position: "bottom",
                    variant: "left-accent",
                });
            } catch (error) {
                toast.update(createAccountToast, {
                    status: "error",
                    title: " Something went wrong",
                });
            }

            let transferPNFTToast = toast({
                title: "Transfer TBA to Recipient",
                position: "bottom",
                variant: "left-accent",
                status: "loading",
                duration: 60000,
            });

            try {
                // // Transfer NFT to the receiver

                await transferPNFT(product.recipient, tokenId);

                toast.update(transferPNFTToast, {
                    title: "Buy Success",
                    isClosable: true,
                    position: "bottom",
                    variant: "left-accent",
                    status: "success",
                });
            } catch (error) {
                toast.update(transferPNFTToast, {
                    title: " Something went wrong",
                    status: "error",
                });
            }

            await new Promise((res) => setTimeout(res, 2000));

            router.push("/");
        }
    }

    if (!isClient) {
        return null;
    }

    return (
        <HStack
            width={"100%"}
            alignItems={"start"}
            justifyContent={"space-between"}
        >
            {isConnected ? (
                <VStack width={"100%"} alignItems={"start"}>
                    <TBAAccounts
                        contributions={contributions}
                        setContributions={setContributions}
                    />
                    {product && (
                        <>
                            <Text>
                                Need more{" "}
                                {totalContribution > product.price
                                    ? 0
                                    : product?.price - totalContribution}{" "}
                                APE tokens
                            </Text>
                            <Progress
                                hasStripe
                                value={progress}
                                size="sm"
                                height="16px"
                                width={"60%"}
                                colorScheme="green"
                                borderRadius={"10"}
                            />
                        </>
                    )}
                </VStack>
            ) : (
                <Text>Please Connect Wallet</Text>
            )}
            {product && (
                <VStack
                    border="1px solid #ddd"
                    borderRadius={"10px"}
                    padding={"10"}
                >
                    <Image
                        alignSelf={"center"}
                        width="400px"
                        height={"300px"}
                        src={product.image}
                        mb="20px"
                    />
                    <VStack
                        width={"100%"}
                        justifyContent={"space-between"}
                        alignItems={"start"}
                    >
                        <Text size={"lg"} fontWeight={"bold"}>
                            {product.price} APE
                        </Text>
                        <Text textAlign={"left"} size={"md"}>
                            {product.name}
                        </Text>
                    </VStack>
                    <Button
                        isDisabled={totalContribution < product.price}
                        mt={"5"}
                        onClick={pay}
                        bg="#0B2BB7"
                        _hover={{ bg: "#0B2Bdf" }}
                        textColor={"white"}
                        width={"100%"}
                    >
                        Pay
                    </Button>
                </VStack>
            )}
        </HStack>
    );
};

export default Buy;

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

const Buy: NextPage = () => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const {
        mintPNFT,
        chain,
        getAccount,
        transferTokens,
        createAccount,
        transferPNFT,
    } = useTBA();

    const [contributions, setContributions] = useState({});
    const [totalContribution, setTotalContribution] = useState(0);
    const [progress, setProgress] = useState(0);

    const [product, setProduct] = useState<Product>();

    useEffect(() => {
        (async () => {
            if (router.query.id) {
                let response = await fetch(
                    `https://fakestoreapi.com/products/${router.query.id}`
                );

                const products = await response.json();
                setProduct(products);
            }
        })();

        return () => {
            setProduct(undefined);
        };
    }, [router.query]);

    useEffect(() => {
        let totalContribution = 0;
        Object.values(contributions).forEach(
            (value) => (totalContribution += Number(value))
        );
        setTotalContribution(totalContribution);
        setProgress((totalContribution * 100) / 4);
    }, [contributions]);

    async function pay() {
        // Mint PNFT
        let nft = await mintPNFT();

        console.log(Number(nft));

        let tokenId = Number(nft);

        // // Address to transfer assets to
        let accountAddress = await getAccount(PNFT[chain?.network], tokenId);

        // // Transfer tokens
        for (const contribution of Object.keys(contributions)) {
            if (
                contributions[contribution] &&
                contributions[contribution] > 0
            ) {
                await transferTokens(
                    contribution,
                    accountAddress,
                    contributions[contribution]
                );
            }
        }

        // // Deploy Account
        let hash = await createAccount(PNFT[chain.network], tokenId);

        // // Transfer NFT to the receiver
        await transferPNFT(
            "0x22e4aFF96b5200F2789033d85fCa9F58f163E9Ea",
            tokenId
        );
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
                    <Text>
                        Need more{" "}
                        {totalContribution > 4 ? 0 : 4 - totalContribution} APE
                        tokens
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
                </VStack>
            ) : (
                <Text>Please Connect Wallet</Text>
            )}
            {product && (
                <VStack border="1px solid" borderRadius={"10px"} padding={"10"}>
                    <Image
                        alignSelf={"center"}
                        width="300px"
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
                            {product.price}
                        </Text>
                        <Text textAlign={"left"} size={"md"}>
                            {product.title}
                        </Text>
                    </VStack>
                    <Button
                        isDisabled={totalContribution < 1}
                        mt={"5"}
                        width={"100%"}
                        onClick={pay}
                    >
                        Pay
                    </Button>
                </VStack>
            )}
        </HStack>
    );
};

export default Buy;

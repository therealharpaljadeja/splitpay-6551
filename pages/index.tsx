import type { NextPage } from "next";
import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePublicClient } from "wagmi";
import useTBA from "../hooks/useTBA";

export type Product = {
    name: string;
    price: string;
    recipient: string;
    image: string;
};

const Home: NextPage = () => {
    const router = useRouter();
    const { getProducts } = useTBA();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        (async () => {
            let products = await getProducts();
            setProducts(products);
        })();

        return () => {
            setProducts([]);
        };
    }, []);

    return (
        <HStack gap="5" width={"100%"} alignItems={"start"}>
            {products.map((product, index) => (
                <VStack
                    key={product.name}
                    border={"1px solid #ddd"}
                    borderRadius={"10px"}
                    padding={"5"}
                    width={"400px"}
                    gap={"10"}
                    alignItems={"start"}
                >
                    <Image
                        alignSelf={"center"}
                        height={"300px"}
                        src={product.image}
                    />
                    <HStack width={"100%"} justifyContent={"space-between"}>
                        <Text textAlign={"left"} size={"md"}>
                            {product.name}
                        </Text>
                        <Text size={"lg"} fontWeight={"bold"}>
                            {product.price} APE
                        </Text>
                    </HStack>
                    <Button
                        onClick={() => router.push(`/buy/${index}`)}
                        bg="#0B2BB7"
                        _hover={{ bg: "#0B2Bdf" }}
                        textColor={"white"}
                        width={"100%"}
                    >
                        Buy
                    </Button>
                </VStack>
            ))}
        </HStack>
    );
};

export default Home;

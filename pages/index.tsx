import type { NextPage } from "next";
import { Button, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export type Product = {
    title: string;
    image: string;
    price: string;
};

const Home: NextPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        (async () => {
            let response = await fetch(
                "https://fakestoreapi.com/products?limit=3"
            );
            const products = await response.json();
            setProducts(products);
        })();

        return () => {
            setProducts([]);
        };
    }, []);

    return (
        <VStack
            // bgGradient={"linear(to-tr,  #4A10FC, #0B2BB7)"}
            height={"100vh"}
            justifyContent={"center"}
            padding={"20"}
        >
            <VStack
                border="1px solid"
                borderRadius={"10px"}
                width={"100%"}
                height={"100%"}
                padding={"10"}
                alignItems={"start"}
                gap={"10"}
            >
                <HStack width={"100%"} justifyContent={"space-between"}>
                    <Heading>ApeCoin Store</Heading>
                    <ConnectButton />
                </HStack>
                <HStack gap="5" width={"100%"} alignItems={"start"}>
                    {products.map((product, index) => (
                        <VStack
                            key={product.title}
                            border={"1px solid"}
                            borderRadius={"10px"}
                            padding={"5"}
                            width={"100%"}
                            gap={"10"}
                            alignItems={"start"}
                        >
                            <Image
                                alignSelf={"center"}
                                height={"300px"}
                                src={product.image}
                            />
                            <HStack
                                width={"100%"}
                                justifyContent={"space-between"}
                            >
                                <Text textAlign={"left"} size={"md"}>
                                    {product.title}
                                </Text>
                                <Text size={"lg"} fontWeight={"bold"}>
                                    {product.price}
                                </Text>
                            </HStack>
                            <Link href={`/buy/${index + 1}`}>
                                <Button width={"100%"}>Buy</Button>
                            </Link>
                        </VStack>
                    ))}
                </HStack>
            </VStack>
        </VStack>
    );
};

export default Home;

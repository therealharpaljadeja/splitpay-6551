import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Layout({ children }) {
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
            >
                <HStack width={"100%"} justifyContent={"space-between"}>
                    <HStack>
                        <Link href="/">
                            <Image src="logo.png" />
                        </Link>
                    </HStack>
                    <HStack gap="5">
                        <Link href="/mypayments">
                            <Text textDecoration={"underline"}>
                                {" "}
                                My Payments
                            </Text>
                        </Link>
                        <ConnectButton />
                    </HStack>
                </HStack>
                {children}
            </VStack>
        </VStack>
    );
}

// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai, mantleTestnet, scrollSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";

const { chains, publicClient } = configureChains(
    [polygonMumbai, scrollSepolia, mantleTestnet],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "ApeCoin Store",
    projectId: "044601f65212332475a09bc14ceb3c34",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;

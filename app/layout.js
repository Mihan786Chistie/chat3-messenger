"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/reduxProvider";
import { WagmiProvider, createConfig } from "wagmi";
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from "next/navigation";


const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

// Create a separate client component for Dynamic context
function DynamicProviderWrapper({ children }) {
  const router = useRouter();
  
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onLogout: () => {
            router.push("/");
          }
        }
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <DynamicProviderWrapper>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  {children}
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </DynamicProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}

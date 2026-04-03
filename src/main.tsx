import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui'
import '@mysten/dapp-kit/dist/index.css'

const queryClient = new QueryClient()

const { networkConfig } = createNetworkConfig({
 testnet: { url: getFullnodeUrl('testnet') },
 mainnet: { url: getFullnodeUrl('mainnet') },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
 <QueryClientProvider client={queryClient}>
 <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
 <WalletProvider>
 <App />
 </WalletProvider>
 </SuiClientProvider>
 </QueryClientProvider>
 </React.StrictMode>,
)

import { Chain } from 'wagmi'

export const cantoTestnet = {
  id: 7701,
  name: 'Canto Testnet',
  network: 'canto',
  nativeCurrency: {
    decimals: 18,
    name: 'Canto',
    symbol: 'CANTO',
  },
  rpcUrls: {
    default: {
      http: ['https://canto-testnet.plexnode.wtf'],
    },
    public: {
      http: ['https://canto-testnet.plexnode.wtf'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Block Explorer (Canto Tenstnet)',
      url: 'https://testnet.tuber.build/',
    },
  },
} as Chain

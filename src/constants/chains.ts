export type ChainData = Record<string, unknown> & {
  id: number
  name: string
  description: string
  logo_uri: string
  color: string
  block_explorer: {
    url: string
    logo_uri: string
    display_name: string
    token_path: string
    address_path: string
  }
}

export const chains: ChainData[] = [
  {
    id: 1,
    name: 'eth',
    description: 'Ethereum',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-1.svg',
    color: '#858585',
    block_explorer: {
      url: 'https://ethereum.dex.guru/',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 10,
    name: 'optimism',
    description: 'Optimism',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-10.svg',
    color: '#fd0026',
    block_explorer: {
      url: 'https://optimism.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 56,
    name: 'bsc',
    description: 'BSC',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-56.png',
    color: '#ff8a1f',
    block_explorer: {
      url: 'https://bnb.dex.guru/',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 100,
    name: 'gnosis',
    description: 'Gnosis',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-100.svg',
    color: '#008b73',
    block_explorer: {
      url: 'https://gnosis.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 137,
    name: 'polygon',
    description: 'Polygon',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-137.svg',
    color: '#863ff8',
    block_explorer: {
      url: 'https://polygon.dex.guru/',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 250,
    name: 'fantom',
    description: 'Fantom',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-250.svg',
    color: '#1969ff',
    block_explorer: {
      url: 'https://fantom.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 42161,
    name: 'arbitrum',
    description: 'Arbitrum',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-42161.svg',
    color: '#7bb6de',
    block_explorer: {
      url: 'https://arbitrum.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 42220,
    name: 'celo',
    description: 'Celo',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-42220.svg',
    color: '#3ecf82',
    block_explorer: {
      url: 'https://celoscan.io',
      logo_uri: 'https://assets-stage.dex.guru/icons/explorer-42220.svg',
      display_name: 'Celo Explorer',
      token_path: '/tokens',
      address_path: '/address',
    },
  },
  {
    id: 43114,
    name: 'avalanche',
    description: 'Avalanche',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-43114.svg',
    color: '#f55c5d',
    block_explorer: {
      url: 'https://snowtrace.io',
      logo_uri: 'https://assets-stage.dex.guru/icons/explorer-43114.svg',
      display_name: 'Snowtrace',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 42170,
    name: 'nova',
    description: 'Nova',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-42170.svg',
    color: '#ce8546',
    block_explorer: {
      url: 'https://nova.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 7700,
    name: 'canto',
    description: 'Canto',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-7700.svg',
    color: '#06fc99',
    block_explorer: {
      url: 'https://canto.dex.guru',
      logo_uri: 'https://assets-stage.dex.guru/icons/blockexplorer.svg',
      display_name: 'Block Explorer by DexGuru',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 324,
    name: 'zksync',
    description: 'zkSync Era',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-324.svg',
    color: '#4e529a',
    block_explorer: {
      url: 'https://explorer.zksync.io',
      logo_uri: 'https://assets-stage.dex.guru/icons/explorer-324.svg',
      display_name: 'EraExplorer',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 321,
    name: 'kcc',
    description: 'KCC',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-321.svg',
    color: '#21c397',
    block_explorer: {
      url: 'https://explorer.kcc.io',
      logo_uri: 'https://assets-stage.dex.guru/icons/kcc-explorer.png',
      display_name: 'EraExplorer',
      token_path: '/token',
      address_path: '/address',
    },
  },
  {
    id: 1101,
    name: 'zkevm',
    description: 'zkEVM Polygon',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-1101.svg',
    color: '#b592ff',
    block_explorer: {
      url: 'https://zkevm.polygonscan.com',
      logo_uri: 'https://assets-stage.dex.guru/icons/explorer-137.png',
      display_name: 'PolygonzkEVMExplorer',
      token_path: '/token',
      address_path: '/address',
    },
  },
]

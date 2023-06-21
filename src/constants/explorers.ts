export type ExplorerData = {
  display_name: string
  url: string
  logo_uri?: string
  address_path?: string
  token_path?: string
  tx_path?: string
  block_path?: string
  smartcontract_path?: string
  id: string
}

export enum Explorers {
  dexguru = 'dexguru',
  tenderly = 'tenderly',
  arbitrumNovaScan = 'arbitrumNovaScan',
  optimismExplorer = 'optimismExplorer',
  gnosisScan = 'gnosisScan',
  ftmScan = 'ftmScan',
  polygonScan = 'polygonScan',
  bscScan = 'bscScan',
  etherscan = 'etherscan',
  baseScan = 'baseScan',
}

const ExplorersData: Record<Explorers, ExplorerData> = {
  dexguru: {
    id: 'dexguru',
    address_path: '/trader/:address/profile',
    display_name: 'DexGuru',
    token_path: '/profile/holding-insights/token/:chain/:address',
    tx_path: '/txid/:tx-:chain',
    url: 'https://dex.guru',
  },
  tenderly: {
    id: 'tenderly',
    address_path: '/wallet/:chain/:address',
    display_name: 'Tenderly',
    url: 'https://dashboard.tenderly.co',
  },
  arbitrumNovaScan: {
    id: 'arbitrumNovaScan',
    address_path: '/address/:address',
    display_name: 'Arbitrum Nova Scan',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-42170.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://nova.arbiscan.io',
  },
  optimismExplorer: {
    id: 'optimismExplorer',
    address_path: '/address/:address',
    display_name: 'The Optimism Explore',
    logo_uri: 'https://assets-stage.dex.guru/icons/chain-10.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://optimistic.etherscan.io',
  },
  gnosisScan: {
    id: 'gnosisScan',
    address_path: '/address/:address',
    display_name: 'GnosisScan',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-100.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://gnosisscan.io',
  },
  ftmScan: {
    id: 'ftmScan',
    address_path: '/address/:address',
    display_name: 'FTMScan',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-250.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://ftmscan.com',
  },
  polygonScan: {
    id: 'polygonScan',
    address_path: '/address/:address',
    display_name: 'PolygonScan',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-137.png',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://polygonscan.com',
  },
  bscScan: {
    id: 'bscScan',
    address_path: '/address/:address',
    display_name: 'BNB Smart Chain Explorer',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-56.png',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://bscscan.com',
  },
  etherscan: {
    id: 'etherscan',
    address_path: '/address/:address',
    display_name: 'Etherscan',
    logo_uri: 'https://assets-stage.dex.guru/icons/explorer-1.png',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://etherscan.io',
  },
  baseScan: {
    id: 'baseScan',
    address_path: '/address/:address',
    display_name: 'Base Goerli Explorer',
    logo_uri: 'https://goerli.basescan.org/images/svg/brands/main.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://goerli.basescan.org',
  },
}

export const explorers: Record<number, ExplorerData[]> = {
  7700: [ExplorersData.dexguru],
  7701: [ExplorersData.dexguru],
  42161: [ExplorersData.dexguru, ExplorersData.tenderly],
  42170: [ExplorersData.dexguru, ExplorersData.arbitrumNovaScan],
  10: [
    ExplorersData.dexguru,
    ExplorersData.optimismExplorer,
    ExplorersData.tenderly,
  ],
  100: [
    ExplorersData.dexguru,
    ExplorersData.gnosisScan,
    ExplorersData.tenderly,
  ],
  250: [ExplorersData.dexguru, ExplorersData.ftmScan, ExplorersData.tenderly],
  137: [
    ExplorersData.dexguru,
    ExplorersData.polygonScan,
    ExplorersData.tenderly,
  ],
  56: [ExplorersData.dexguru, ExplorersData.bscScan, ExplorersData.tenderly],
  1: [ExplorersData.dexguru, ExplorersData.etherscan, ExplorersData.tenderly],
  84531: [ExplorersData.baseScan],
}

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
  eigenphi = 'eigenphi',
  arbitrumNovaScan = 'arbitrumNovaScan',
  optimismExplorer = 'optimismExplorer',
  gnosisScan = 'gnosisScan',
  ftmScan = 'ftmScan',
  polygonScan = 'polygonScan',
  bscScan = 'bscScan',
  etherscan = 'etherscan',
  baseGoerliScan = 'baseGoerliScan',
  baseScan = 'baseScan',
}

const explorersData: Record<Explorers, ExplorerData> = {
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
    tx_path: '/tx/:chain/:tx',
    display_name: 'Tenderly',
    url: 'https://dashboard.tenderly.co',
  },
  eigenphi: {
    id: 'eigenphi',
    tx_path: '/mev/eigentx/:tx',
    display_name: 'EigenPhi',
    url: 'https://eigenphi.io',
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
    display_name: 'The Optimism Explorer',
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
  baseGoerliScan: {
    id: 'baseScan',
    address_path: '/address/:address',
    display_name: 'Base Goerli Explorer',
    logo_uri: 'https://goerli.basescan.org/images/svg/brands/main.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://goerli.basescan.org',
  },
  baseScan: {
    id: 'baseScan',
    address_path: '/address/:address',
    display_name: 'Base Explorer',
    logo_uri: 'https://basescan.org/images/svg/brands/main.svg',
    token_path: '/token/:address',
    tx_path: '/tx/:tx',
    block_path: '/block/:tx',
    url: 'https://basescan.org',
  },
}

export const explorers: Record<number, ExplorerData[]> = {
  7700: [explorersData.dexguru],
  7701: [explorersData.dexguru],
  42161: [
    explorersData.dexguru,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  42170: [explorersData.dexguru, explorersData.arbitrumNovaScan],
  10: [
    explorersData.dexguru,
    explorersData.optimismExplorer,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  100: [
    explorersData.dexguru,
    explorersData.gnosisScan,
    explorersData.tenderly,
  ],
  250: [
    explorersData.dexguru,
    explorersData.ftmScan,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  137: [
    explorersData.dexguru,
    explorersData.polygonScan,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  56: [
    explorersData.dexguru,
    explorersData.bscScan,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  1: [
    explorersData.dexguru,
    explorersData.etherscan,
    explorersData.tenderly,
    explorersData.eigenphi,
  ],
  84531: [explorersData.baseGoerliScan],
  8453: [explorersData.baseScan],
}

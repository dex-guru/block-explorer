import { gql } from '@apollo/client'

import { CHAIN_ID, CHAIN_IDS } from '@/constants'

export const TRANSACTIONS_LAST = gql`
  query Transactions {
    transactions(first: 10, chainId: ${CHAIN_ID}) {
      hash
      blockHash
      blockNumber
      blockTimestamp
      fromAddress
      toAddress
      value
    }
  }
`

export const CHAIN_HEALTH = gql`
  query ChainStats {
    blocks(first: 1, skip: 0, chainId: ${CHAIN_ID}) {
      number
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const CHAIN_STATS = gql`
  query ChainStats {
    chainStats(chainId: ${CHAIN_ID}) {
      lastBlockNumber
      liquidity24hDelta
      liquidityUsd
      marketCap
      mediumGasPrice
      nativeTokenPriceUsd
      nativeTokenPriceUsd24hDelta
      tokenSupply
      transactionsCount
      transactionsPerSecond
      transactionsCountHistory {
        timestamp
        value
      }
      volume24hDeltaUsd
      volume24hUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const CHAIN_STATS_FULL = gql`
  query ChainStatsFull {
    chainStats(chainId: ${CHAIN_ID}) {
      activeAddressesCount
      activeAddressesCount24h
      averageBlockTime
      lastBlockNumber
      liquidity24hDelta
      liquidityUsd
      marketCap
      mediumGasPrice
      nativeTokenPriceUsd
      nativeTokenPriceUsd24hDelta
      smartContractsCount
      tokenSupply
      transactionsCount
      transactionsPerSecond
      transactionsPerSecondDailyAVG
      transactionsPerSecondFiveMinutesAVG
      transactionsCountHistory {
        timestamp
        value
      }
      volume24hDeltaUsd
      volume24hUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TRANSACTIONS_STATS = gql`
  query TransactionsStats {
    transactionStats(chainId: ${CHAIN_ID}) {
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      avgTransactionsFee24H
      avgTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats(chainId: ${CHAIN_ID}) {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TRANSACTIONS = gql`
  query Transactions(
    $first: Long!
    $skip: Long!
    $address: String
    $blockNumber: Long
  ) {
    transactions(
      first: $first
      skip: $skip
      address: $address
      blockNumber: $blockNumber
      chainId: ${CHAIN_ID}
    ) {
      blockNumber
      blockTimestamp
      hash
      fromAddress
      toAddress
      value
      blockHash
    }
    transactionStats(
      address: $address
      blockNumber: $blockNumber
      chainId: ${CHAIN_ID}
    ) {
      transactionsCount
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats(chainId: ${CHAIN_ID}) {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_INTERNAL_TXS_WITH_TOTAL_AND_CHAIN = gql`
  query InternalTxs($first: Long!, $skip: Long!, $address: String, $hash: String) {
    internalTransactions(first: $first, skip: $skip, address: $address, hash: $hash, chainId: ${CHAIN_ID}) {
      data {
        blockNumber
        blockTimestamp
        fromAddress
        gasLimit
        hash
        toAddress
        type
        value
      }
      total
    }
    chainStats(chainId: ${CHAIN_ID}) {
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_INTERNAL_TXS = gql`
  query InternalTxs($first: Long!, $skip: Long!, $address: String, $hash: String) {
    internalTransactions(first: $first, skip: $skip, address: $address, hash: $hash, chainId: ${CHAIN_ID}) {
      data {
        blockNumber
        blockTimestamp
        fromAddress
        gasLimit
        hash
        toAddress
        type
        value
      }
    }
  }
`

export const GET_BLOCKS = gql`
  query Blocks($first: Long!, $skip: Long!) {
    blocks(first: $first, skip: $skip, chainId: ${CHAIN_ID}) {
      baseFeePerGas
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      miner
      nonce
      number
      parentHash
      receiptsRoot
      sha3Uncles
      size
      stateRoot
      timestamp
      totalDifficulty
      transactionCount
      transactionsRoot
    }
    blockStats(chainId: ${CHAIN_ID}) {
      blocksCount
      burntFees
      lastSafeBlock
      networkUtilization24H
    }
    chainStats(chainId: ${CHAIN_ID}) {
      lastBlockNumber
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_BLOCKS_SHORT = gql`
  query Blocks($first: Long!, $skip: Long!) {
    blocks(first: $first, skip: $skip, chainId: ${CHAIN_ID}) {
      hash
      number
      miner
      transactionCount
      timestamp
      gasUsed
      gasLimit
    }
  }
`

export const GET_HISTORICAL_TOKEN_PRICE = gql`
  query HistoricalNativePrice(
    $address: String!
    $fromTs: Int!
    $toTs: Int!
    $currencyCode: CurrencyChoices!
    $resolution: String!
  ) {
    historicalPrice(
      address: $address
      chainId: ${CHAIN_ID}
      fromTs: $fromTs
      toTs: $toTs
      currencyCode: $currencyCode
      resolution: $resolution
    ) {
      c
    }
  }
`

export const GET_TOP_TOKENS = gql`
  query TopTokens($first: Long!, $skip: Long!, $onlyVerified: Boolean) {
    topTokens(first: $first, skip: $skip, onlyVerified: $onlyVerified, chainId: ${CHAIN_ID}) {
      data {
        volume24h
        symbol
        priceChange24h
        price
        name
        logoURI
        liquidity
        address
      }
      total
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TRANSACTIONS_BY_HASH = gql`
  query TransactionByHash($hash: String!) {
    transactions(hash: $hash, first: 1, chainId: ${CHAIN_ID}) {
      blockHash
      blockNumber
      blockTimestamp
      fromAddress
      gas
      gasPrice
      hash
      input
      maxFeePerGas
      maxPriorityFeePerGas
      nonce
      receiptContractAddress
      receiptCumulativeGasUsed
      receiptEffectiveGasPrice
      receiptGasUsed
      receiptRoot
      receiptStatus
      receiptLogsCount
      status
      toAddress
      transactionIndex
      transactionType
      value
    }
    chainStats(chainId: ${CHAIN_ID}) {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      dexes {
        description
        displayName
        logoURI
        name
      }
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TRANSACTION_LOGS = gql`
  query TransactionLogs($hash: String!) {
    logs(transactionHash: $hash, chainId: ${CHAIN_ID}) {
      address
      blockHash
      blockNumber
      data
      eventName
      logIndex
      topics
      transactionHash
      transactionIndex
      decodedInput {
        isIndexed
        name
        type
        value
      }
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TRANSACTION_TRACES = gql`
  query TracesByHash($hash: String!) {
    traces(txHash: $hash, chainId: ${CHAIN_ID}) {
      tracesJSON
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_BLOCKS_BY_NUMBER = gql`
  query BlokByNumber($number: Long) {
    blocks(first: 1, number: $number, chainId: ${CHAIN_ID}) {
      baseFeePerGas
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      miner
      nonce
      number
      parentHash
      receiptsRoot
      sha3Uncles
      size
      stateRoot
      timestamp
      totalDifficulty
      transactionCount
      transactionsRoot
    }
    chainStats(chainId: ${CHAIN_ID}) {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_CSR_STATS = gql`
  query CSRStats {
    csrStats {
      burned {
        timestamp
        value
      }
      netEmissions {
        timestamp
        value
      }
      sumRevenue
      sumTx
      sumContracts
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_ADDRESS_INFO = gql`
  query GetAddressInfo($address: String!) {
    address(address: $address, chainId: ${CHAIN_ID}) {
      address
      addressType
      name
      nativeBalance
      nativeBalanceUSD
      logoURL
      symbol
      tokenLists
    }
    tokenHoldingsStats(address: $address, chainId: ${CHAIN_ID}) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
    chainStats(chainId: ${CHAIN_ID}) {
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_CONTRACT_INFO = gql`
  query GetContractInfo($address: String!) {
    contractCreator(address: $address, chainId: ${CHAIN_ID}) {
      creatorAddress
      timestamp
      txHash
    }
    balancesStats(tokenAddress: $address, chainId: ${CHAIN_ID}) {
      holders
      maxTotalSupply
      price
      priceChange
      priceNative
      totalTransfers
      fullyDilutedValuation
      holdersChange
      holdersChart {
        timestamp
        value
      }
    }
  }
`

export const GET_TOKEN_INFO = gql`
  query GetTokenInfo($address: String!, $ticker: String!) {
    checkTokenImpersonator(address: $address, ticker: $ticker, chainId: ${CHAIN_ID})
  }
`

export const GET_ADDRESS_TOKENS_STATS = gql`
  query GetAddressTokens($address: String!) {
    tokenHoldingsStats(address: $address, chainId: ${CHAIN_ID}) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_ADDRESS_TOKENS = gql`
  query GetAddressTokens(
    $address: String!
    $first: Long!
    $skip: Long!
    
  ) {
    tokenHoldings(
      address: $address
      first: $first
      skip: $skip
      chainId: ${CHAIN_ID}
    ) {
      asset
      change24H
      contractAddress
      logo
      price
      quantity
      symbol
      value
    }
    tokenHoldingsStats(address: $address, chainId: ${CHAIN_ID}) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
  }
`

export const GET_ADDRESS_HOLDERS = gql`
  query GetAddressHolders(
    $address: String!
    $first: Long!
    $skip: Long!
    
  ) {
    balances(
      tokenAddress: $address
      first: $first
      skip: $skip
      chainId: ${CHAIN_ID}
    ) {
      address
      holderType
      label
      percentage
      quantity
      value
    }
    balancesStats(tokenAddress: $address, chainId: ${CHAIN_ID}) {
      fullyDilutedValuation
      holders
      holdersChange
      maxTotalSupply
      price
      priceChange
      priceNative
      totalTransfers
    }
  }
`

export const GET_SEARCH = gql`
  query GetSearch($query: String!) {
    search(first: 10, query: $query, chainId: ${CHAIN_ID}) {
      blocks {
        transactionCount
        timestamp
        number
      }
      addresses {
        address
        addressType
        assetsCount
        assetsValueUSD
        assetsValueUSD24hDelta
        nativeBalance
        nativeBalanceUSD
        name
        logoURL
        symbol
      }
      transactions {
        hash
        value
        transactionType
        blockNumber
        fromAddress
        toAddress
        blockTimestamp
      }
    }
  }
`

export const GET_ERC721_EVENTS = gql`
  query Erc721Events(
    $first: Long
    $address: String
    $hash: String
    $skip: Long
  ) {
    nftEvents(
      first: $first
      address: $address
      hash: $hash
      skip: $skip
      chainId: ${CHAIN_ID}
    ) {
      data {
        blockTimestamp
        fromAddress
        hash
        operatorAddress
        toAddress
        tokenAddress
        tokenId
        value
      }
      total
    }
  }
`

export const GET_ERC20_EVENTS = gql`
  query Erc20Events(
    $first: Long
    $address: String
    $skip: Long
    $walletAddress: String
    $hash: String
    $eventTypes: String
  ) {
    erc20Events(
      address: $address
      first: $first
      hash: $hash
      skip: $skip
      walletAddress: $walletAddress
      eventTypes: $eventTypes
      chainId: ${CHAIN_ID}
    ) {
      total
      data {
        amounts
        blockTimestamp
        dex
        eventType
        fromAddress
        hash
        prices
        toAddress
        tokenAddresses
        tokenSymbols
        tokenLogos
        tokenNames
      }
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      dexes {
        description
        displayName
        logoURI
        name
      }
    }
  }
`

export const GET_ERC20_EVENTS_TOTALS = gql`
  query Erc20EventsTotal(
    $address: String
    $walletAddress: String
    $hash: String
    $eventTypes: String
  ) {
    erc20Events(
      fullTotals: true
      address: $address
      hash: $hash
      walletAddress: $walletAddress
      eventTypes: $eventTypes
      chainId: ${CHAIN_ID}
    ) {
      total
    }
  }
`

export const GET_BLOCKS_TXNS_CHAIN_STATS = gql`
  query MainPageData(
    $first: Long!
    $skip: Long!
  ) {
    blocks(first: $first, skip: $skip, chainId: ${CHAIN_ID}) {
      hash
      number
      miner
      transactionCount
      timestamp
      gasUsed
      gasLimit
    }
    transactions(first: $first, skip:  $skip, chainId: ${CHAIN_ID}) {
      hash
      blockHash
      blockNumber
      blockTimestamp
      fromAddress
      toAddress
      value
    }
    chainStats(chainId: ${CHAIN_ID}) {
      activeAddressesCount
      activeAddressesCount24h
      averageBlockTime
      lastBlockNumber
      liquidity24hDelta
      liquidityUsd
      marketCap
      mediumGasPrice
      nativeTokenPriceUsd
      nativeTokenPriceUsd24hDelta
      smartContractsCount
      tokenSupply
      transactionsCount
      transactionsPerSecond
      transactionsPerSecondDailyAVG
      transactionsPerSecondFiveMinutesAVG
      transactionsCountHistory {
        timestamp
        value
      }
      volume24hDeltaUsd
      volume24hUsd
    }
    ${
      CHAIN_ID === CHAIN_IDS.CANTO
        ? `csrStats {
        sumRevenue
      }`
        : ''
    }
    chainConfig(chainId: ${CHAIN_ID}) {
      message {
        text
        type
      }
      description
      blockTime
      chain
      chainColor
      chainId
      explorers {
        name
        standard
        url
      }
      faucets
      features {
        name
      }
      gasUnit
      infoURL
      name
      icon
      nativeCurrency {
        decimals
        name
        symbol
        wrappedAddress
      }
      networkId
      rpc
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_LOGS_BY_ADDRESS = gql`
  query Logs(
    $first: Long
    $skip: Long
    $address: String!
  ) {
    address (
      address: $address
      chainId: ${CHAIN_ID}
    ) {
      receiptLogsCount
    }
    logs(
      first: $first
      skip: $skip
      address: $address
      chainId: ${CHAIN_ID}
    ) {
      address
      blockHash
      blockNumber
      data
      decodedInput {
        isIndexed
        name
        type
        value
      }
      eventName
      logIndex
      topics
      transactionHash
      transactionIndex
    }
  }
`

export const GET_COSMOS_TRANSACTIONS = gql`
  query CosmosTxns {
    cosmos(chainId: ${CHAIN_ID}) {
      transactions {
        blockNumber
        blockTimestamp
        hash
      }
    }
  }
`

export const GET_CHAIN_CONFIG = gql`
query ChainConfig {
  chainConfig(chainId: ${CHAIN_ID}){
    blockTime
    chain
    chainColor
    chainId
    explorers {
      name
      standard
      url
    }
    faucets
    features {
      name
    }
    gasUnit
    infoURL
    message
    name
    icon
    nativeCurrency {
      decimals
      name
      symbol
      wrappedAddress
    }
    networkId
    rpc
    shortName
    relatives {
      name
      standard
      url
    }
  }
}`

export const GET_CONTRACT_CODE = gql`
query GetContractCode ($address: String!) {
  contractCode(address: $address, chainId: ${CHAIN_ID}){
    code
  }
}`

export const GET_ALL_CHAINS = gql`
  query GetAllChainConfigs {
    allChainConfigs {
      chainColor
      name
      chain
      chainId
      explorers {
        name
        standard
        url
      }
      guruBlockExplorer {
        addressPath
        displayName
        logoURI
        tokenPath
        url
      }
      icon
      infoURL
      networkId
      shortName
      relatives {
        name
        standard
        url
      }
    }
  }
`

export const GET_TOKENS_INFO = gql`
  query GetTokensInfo ($addresses: [String!]! ) {
    tokens(addresses: $addresses, chainId: ${CHAIN_ID}) {
    address
    decimals
    logoURI
    name
    symbol
  } 
}`

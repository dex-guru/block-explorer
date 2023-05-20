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
    csrStats {
      sumRevenue
    }
    chainConfig(chainId: ${CHAIN_ID}) {
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
    }
  }
`

export const GET_TRANSACTIONS_STATS = gql`
  query TransactionsStats {
    transactionStats(chainId: ${CHAIN_ID}) {
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
      toAddress
      transactionIndex
      transactionType
      value
    }
    erc20Events(hash: $hash, chainId: ${CHAIN_ID}) {
      data {
        fromAddress
        toAddress
        tokenAddresses
        tokenSymbols
        eventType
        hash
        blockTimestamp
        amounts
      }
      total
    }
    nftEvents(hash: $hash, chainId: ${CHAIN_ID}) {
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
    }
    chainStats(chainId: ${CHAIN_ID}) {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
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
    }
  }
`

export const GET_TRANSACTION_LOGS = gql`
  query TransactionByHash($hash: String!) {
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
    }
  }
`

export const GET_TRANSACTION_TRACES = gql`
  query TracecByHash($hash: String!) {
    traces(txHash: $hash, chainId: ${CHAIN_ID}) {
      tracesJSON
    }
    chainConfig(chainId: ${CHAIN_ID}) {
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
    }
    contractCreator(address: $address, chainId: ${CHAIN_ID}) {
      creatorAddress
      timestamp
      txHash
    }
    tokenHoldingsStats(address: $address, chainId: ${CHAIN_ID}) {
      change24H
      tokenCount
      totalNative
      totalStable
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
    chainStats(chainId: ${CHAIN_ID}) {
      nativeTokenPriceUsd
    }
    chainConfig(chainId: ${CHAIN_ID}) {
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
    }
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

export const GET_ERC721_BY_ADDRESS = gql`
  query nftEvents(
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
export const GET_ERC20_BY_ADDRESS = gql`
  query Erc20ByAddress(
    $first: Long
    $address: String
    $skip: Long
    $walletAddress: String
    $hash: String
    
  ) {
    erc20Events(
      address: $address
      first: $first
      hash: $hash
      skip: $skip
      walletAddress: $walletAddress
      chainId: ${CHAIN_ID}
    ) {
      total
      data {
        amounts
        blockTimestamp
        eventType
        fromAddress
        hash
        toAddress
        tokenAddresses
        tokenSymbols
      }
    }
  }
`

export const GET_BLOCKS_TXNS_CHAIN_STATS = gql`
  query MainPageData {
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
    ${
      CHAIN_ID === CHAIN_IDS.CANTO
        ? `csrStats {
        sumRevenue
      }`
        : ''
    }
    chainConfig(chainId: ${CHAIN_ID}) {
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
    }
  }
`

export const GET_LOGS_BY_ADDRESS = gql`
  query Logs($address: String) {
    logs(address: $address, chainId: ${CHAIN_ID}) {
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
  }
}`

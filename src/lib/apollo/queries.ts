import { gql } from '@apollo/client'

export const TRANSACTIONS_FIRST_TEN = gql`
  query Transactions {
    transactions(first: 10) {
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
export const TRANSACTIONS = gql`
  query TransactionsNextTen($first: Int!) {
    transactions(first: $first) {
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

export const BLOCKS_LAST = gql`
  query Blocks {
    blocks(first: 10) {
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

export const TRANSACTIONS_LAST = gql`
  query Transactions {
    transactions(first: 10) {
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

export const CHAIN_CONFIG = gql`
  query ChainConfig {
    chainConfig {
      chain
      chainId
      faucets
      infoURL
      name
      nativeCurrency {
        decimals
        name
        symbol
      }
      explorers {
        name
        standard
        url
      }
      networkId
      rpc
      shortName
      message
    }
  }
`

export const CHAIN_STATS = gql`
  query ChainStats {
    chainStats {
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
    chainConfig {
      nativeCurrency {
        decimals
        name
        symbol
      }
      message
    }
  }
`

export const GET_TRANSACTIONS_STATS = gql`
  query TransactionsStats {
    transactionStats {
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const BLOCKS_STATS = gql`
  query BlocksStats {
    blockStats {
      blocksCount
      burntFees
      lastSafeBlock
      networkUtilization24H
    }
    chainStats {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_TRANSACTIONS = gql`
  query Transactions(
    $first: Int!
    $skip: Int!
    $address: String
    $blockNumber: Int
  ) {
    transactions(
      first: $first
      skip: $skip
      address: $address
      blockNumber: $blockNumber
    ) {
      blockNumber
      blockTimestamp
      hash
      fromAddress
      toAddress
      value
      blockHash
    }
    transactionStats(address: $address, blockNumber: $blockNumber) {
      transactionsCount
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_BLOCKS = gql`
  query Blocks($first: Int!, $skip: Int!) {
    blocks(first: $first, skip: $skip) {
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
    blockStats {
      blocksCount
      burntFees
      lastSafeBlock
      networkUtilization24H
    }
    chainStats {
      lastBlockNumber
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_BLOCKS_SHORT = gql`
  query Blocks($first: Int!, $skip: Int!) {
    blocks(first: $first, skip: $skip) {
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
    transactions(hash: $hash, first: 1) {
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
      toAddress
      transactionIndex
      transactionType
      value
    }
    logs(transactionHash: $hash) {
      logIndex
    }
    erc20Events(hash: $hash) {
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
    nftEvents(hash: $hash) {
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
    chainStats {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_TRANSACTION_LOGS = gql`
  query TransactionByHash($hash: String!) {
    logs(transactionHash: $hash) {
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
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_TRANSACTION_TRACES = gql`
  query TracecByHash($hash: String!) {
    traces(txHash: $hash) {
      tracesJSON
    }
  }
`

export const GET_BLOCKS_BY_NUMBER = gql`
  query BlokByNumber($number: Int) {
    blocks(first: 1, number: $number) {
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
    chainStats {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
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
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_ADDRESS_INFO = gql`
  query GetAddressInfo($address: String!) {
    address(address: $address) {
      address
      addressType
      nativeBalance
      nativeBalanceUSD
    }
    contractCreator(address: $address) {
      creatorAddress
      timestamp
      txHash
    }
    tokenHoldingsStats(address: $address) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
    chainStats {
      nativeTokenPriceUsd
    }
    chainConfig {
      shortName
      nativeCurrency {
        decimals
        name
        symbol
      }
      name
    }
  }
`

export const GET_ADDRESS_TOKENS_STATS = gql`
  query GetAddressTokens($address: String!) {
    tokenHoldingsStats(address: $address) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
  }
`

export const GET_ADDRESS_TOKENS = gql`
  query GetAddressTokens($address: String!, $first: Int!, $skip: Int!) {
    tokenHoldings(address: $address, first: $first, skip: $skip) {
      asset
      change24H
      contractAddress
      logo
      price
      quantity
      symbol
      value
    }
    tokenHoldingsStats(address: $address) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
  }
`

export const GET_ADDRESS_HOLDERS = gql`
  query GetAddressHolders($address: String!, $first: Int!, $skip: Int!) {
    balances(tokenAddress: $address, first: $first, skip: $skip) {
      address
      holderType
      label
      percentage
      quantity
      value
    }
    balancesStats(tokenAddress: $address) {
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
    search(first: 10, query: $query) {
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
  query nftEvents($first: Int, $address: String, $hash: String, $skip: Int) {
    nftEvents(first: $first, address: $address, hash: $hash, skip: $skip) {
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
    $first: Int
    $address: String
    $skip: Int
    $walletAddress: String
    $hash: String
  ) {
    erc20Events(
      address: $address
      first: $first
      hash: $hash
      skip: $skip
      walletAddress: $walletAddress
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
  query ExampleQuery($first: Int!, $skip: Int!) {
    blocks(first: $first, skip: $skip) {
      hash
      number
      miner
      transactionCount
      timestamp
      gasUsed
      gasLimit
    }
    transactions(first: 10, skip: 0) {
      hash
      blockHash
      blockNumber
      blockTimestamp
      fromAddress
      toAddress
      value
    }
    chainStats {
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
    chainConfig {
      nativeCurrency {
        decimals
        name
        symbol
      }
    }
  }
`

export const GET_LOGS_BY_ADDRESS = gql`
  query Logs($address: String) {
    logs(address: $address) {
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

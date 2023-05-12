import { gql } from '@apollo/client'

export const TRANSACTIONS_LAST = gql`
  query Transactions($chainId: Int) {
    transactions(first: 10, chainId: $chainId) {
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
  query ChainStats($chainId: Int) {
    chainStats(chainId: $chainId) {
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
    chainConfig(chainId: $chainId) {
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
  query TransactionsStats($chainId: Int) {
    transactionStats(chainId: $chainId) {
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats(chainId: $chainId) {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig(chainId: $chainId) {
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
    $chainId: Int
  ) {
    transactions(
      first: $first
      skip: $skip
      address: $address
      blockNumber: $blockNumber
      chainId: $chainId
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
      chainId: $chainId
    ) {
      transactionsCount
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
    }
    chainStats(chainId: $chainId) {
      transactionsCount
      transactionsPerSecond
      nativeTokenPriceUsd
    }
    chainConfig(chainId: $chainId) {
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
  query Blocks($first: Int!, $skip: Int!, $chainId: Int) {
    blocks(first: $first, skip: $skip, chainId: $chainId) {
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
    blockStats(chainId: $chainId) {
      blocksCount
      burntFees
      lastSafeBlock
      networkUtilization24H
    }
    chainStats(chainId: $chainId) {
      lastBlockNumber
    }
    chainConfig(chainId: $chainId) {
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
  query Blocks($first: Int!, $skip: Int!, $chainId: Int) {
    blocks(first: $first, skip: $skip, chainId: $chainId) {
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
  query TransactionByHash($hash: String!, $chainId: Int) {
    transactions(hash: $hash, first: 1, chainId: $chainId) {
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
    logs(transactionHash: $hash, chainId: $chainId) {
      logIndex
    }
    erc20Events(hash: $hash, chainId: $chainId) {
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
    nftEvents(hash: $hash, chainId: $chainId) {
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
    chainStats(chainId: $chainId) {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig(chainId: $chainId) {
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
  query TransactionByHash($hash: String!, $chainId: Int) {
    logs(transactionHash: $hash, chainId: $chainId) {
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
    chainConfig(chainId: $chainId) {
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
  query TracecByHash($hash: String!, $chainId: Int) {
    traces(txHash: $hash, chainId: $chainId) {
      tracesJSON
    }
    chainConfig(chainId: $chainId) {
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

export const GET_BLOCKS_BY_NUMBER = gql`
  query BlokByNumber($number: Int, $chainId: Int) {
    blocks(first: 1, number: $number, chainId: $chainId) {
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
    chainStats(chainId: $chainId) {
      lastBlockNumber
      nativeTokenPriceUsd
    }
    chainConfig(chainId: $chainId) {
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
    chainConfig(chainId: 7700) {
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
  query GetAddressInfo($address: String!, $chainId: Int) {
    address(address: $address, chainId: $chainId) {
      address
      addressType
      name
      nativeBalance
      nativeBalanceUSD
    }
    contractCreator(address: $address, chainId: $chainId) {
      creatorAddress
      timestamp
      txHash
    }
    tokenHoldingsStats(address: $address, chainId: $chainId) {
      change24H
      tokenCount
      totalNative
      totalStable
    }
    balancesStats(tokenAddress: $address, chainId: $chainId) {
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
    chainStats(chainId: $chainId) {
      nativeTokenPriceUsd
    }
    chainConfig(chainId: $chainId) {
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
  query GetAddressTokens($address: String!, $chainId: Int) {
    tokenHoldingsStats(address: $address, chainId: $chainId) {
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
    $first: Int!
    $skip: Int!
    $chainId: Int
  ) {
    tokenHoldings(
      address: $address
      first: $first
      skip: $skip
      chainId: $chainId
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
    tokenHoldingsStats(address: $address, chainId: $chainId) {
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
    $first: Int!
    $skip: Int!
    $chainId: Int
  ) {
    balances(
      tokenAddress: $address
      first: $first
      skip: $skip
      chainId: $chainId
    ) {
      address
      holderType
      label
      percentage
      quantity
      value
    }
    balancesStats(tokenAddress: $address, chainId: $chainId) {
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
  query GetSearch($query: String!, $chainId: Int) {
    search(first: 10, query: $query, chainId: $chainId) {
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
    $first: Int
    $address: String
    $hash: String
    $skip: Int
    $chainId: Int
  ) {
    nftEvents(
      first: $first
      address: $address
      hash: $hash
      skip: $skip
      chainId: $chainId
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
    $first: Int
    $address: String
    $skip: Int
    $walletAddress: String
    $hash: String
    $chainId: Int
  ) {
    erc20Events(
      address: $address
      first: $first
      hash: $hash
      skip: $skip
      walletAddress: $walletAddress
      chainId: $chainId
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
  query ExampleQuery($first: Int!, $skip: Int!, $chainId: Int) {
    blocks(first: $first, skip: $skip, chainId: $chainId) {
      hash
      number
      miner
      transactionCount
      timestamp
      gasUsed
      gasLimit
    }
    transactions(first: 10, skip: 0, chainId: $chainId) {
      hash
      blockHash
      blockNumber
      blockTimestamp
      fromAddress
      toAddress
      value
    }
    chainStats(chainId: $chainId) {
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
    chainConfig(chainId: $chainId) {
      nativeCurrency {
        decimals
        name
        symbol
      }
    }
    cosmos(chainId: $chainId) {
      transactions {
        blockNumber
        blockTimestamp
        hash
      }
    }
  }
`

export const GET_LOGS_BY_ADDRESS = gql`
  query Logs($address: String, $chainId: Int) {
    logs(address: $address, chainId: $chainId) {
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
  query CosmosTxns($chainId: Int) {
    cosmos(chainId: $chainId) {
      transactions {
        blockNumber
        blockTimestamp
        hash
      }
    }
  }
`

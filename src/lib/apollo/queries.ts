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
    }
  }
`

export const TRANSACTIONS_STATS = gql`
  query TransactionsStats {
    transactionStats {
      networkTransactionsFee24H
      networkTransactionsFeeDelta24H
      transactions24H
      transactionsDelta24H
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
      assetsCount
      assetsValueUSD
      assetsValueUSD24hDelta
      nativeBalance
      nativeBalanceUSD
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
export const GET_ERC721_BY_ADDRESS = gql`
  query Erc721Events($first: Int, $address: String, $hash: String, $skip: Int) {
    erc721Events(first: $first, address: $address, hash: $hash, skip: $skip) {
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

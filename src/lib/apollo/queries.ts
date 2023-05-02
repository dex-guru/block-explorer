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
  query TransactionsByHash($hash: String) {
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
  }
`

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
  }
`

export const GET_TRANSACTIONS = gql`
  query Transactions($first: Int!, $skip: Int!) {
    transactions(first: $first, skip: $skip) {
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

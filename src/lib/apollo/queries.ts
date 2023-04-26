import { gql } from '@apollo/client'

export const TRANSACTIONS_FIRST_TEN = gql`
  query Transactions {
    transactions(first: 10) {
      blockHash
      blockNumber
    }
  }
`
export const TRANSACTIONS = gql`
  query TransactionsNextTen($first: Int!) {
    transactions(first: $first) {
      blockHash
      blockNumber
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

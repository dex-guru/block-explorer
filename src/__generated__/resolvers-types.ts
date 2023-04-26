/* eslint-disable */
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Decimal: any
}

export type BlockModel = {
  __typename?: 'BlockModel'
  baseFeePerGas?: Maybe<Scalars['Int']>
  difficulty: Scalars['Decimal']
  extraData: Scalars['String']
  gasLimit: Scalars['Decimal']
  gasUsed: Scalars['Decimal']
  hash: Scalars['String']
  logsBloom: Scalars['String']
  miner: Scalars['String']
  nonce: Scalars['String']
  number: Scalars['Int']
  parentHash: Scalars['String']
  receiptsRoot: Scalars['String']
  sha3Uncles: Scalars['String']
  size: Scalars['Int']
  stateRoot: Scalars['String']
  timestamp: Scalars['Int']
  totalDifficulty: Scalars['Decimal']
  transactionCount: Scalars['Int']
  transactionsRoot: Scalars['String']
}

export type ChainStatsModel = {
  __typename?: 'ChainStatsModel'
  lastBlockNumber: Scalars['Int']
  liquidity24hDelta: Scalars['Decimal']
  liquidityUsd: Scalars['Decimal']
  marketCap: Scalars['Decimal']
  mediumGasPrice: Scalars['Decimal']
  nativeTokenPriceUsd: Scalars['Decimal']
  nativeTokenPriceUsd24hDelta: Scalars['Decimal']
  tokenSupply: Scalars['Decimal']
  transactionsCount: Scalars['Int']
  transactionsCountHistory: Array<TimeSeriesChartModel>
  transactionsPerSecond: Scalars['Decimal']
  volume24hDeltaUsd: Scalars['Decimal']
  volume24hUsd: Scalars['Decimal']
}

export type LogModel = {
  __typename?: 'LogModel'
  address: Scalars['String']
  blockHash: Scalars['String']
  blockNumber: Scalars['Int']
  data: Scalars['String']
  logIndex: Scalars['Int']
  topics: Array<Scalars['String']>
  transactionHash: Scalars['String']
  transactionIndex: Scalars['Int']
}

export type Query = {
  __typename?: 'Query'
  /** Get blocks */
  blocks: Array<BlockModel>
  /** Get transactions */
  chainStats: ChainStatsModel
  /** Get logs */
  logs: Array<LogModel>
  /** Get transactions */
  transactions: Array<TransactionModel>
}

export type QueryBlocksArgs = {
  first: Scalars['Int']
  number?: InputMaybe<Scalars['Int']>
  skip?: Scalars['Int']
}

export type QueryLogsArgs = {
  first: Scalars['Int']
  skip?: Scalars['Int']
  transactionHash: Scalars['String']
}

export type QueryTransactionsArgs = {
  blockNumber?: InputMaybe<Scalars['Int']>
  first: Scalars['Int']
  hash?: InputMaybe<Scalars['String']>
  skip?: Scalars['Int']
}

export type TimeSeriesChartModel = {
  __typename?: 'TimeSeriesChartModel'
  timestamp: Scalars['Int']
  value: Scalars['Int']
}

export type TransactionModel = {
  __typename?: 'TransactionModel'
  blockHash: Scalars['String']
  blockNumber: Scalars['Int']
  blockTimestamp: Scalars['Int']
  fromAddress: Scalars['String']
  gas: Scalars['Int']
  gasPrice: Scalars['Decimal']
  hash: Scalars['String']
  input: Scalars['String']
  maxFeePerGas?: Maybe<Scalars['Decimal']>
  maxPriorityFeePerGas?: Maybe<Scalars['Decimal']>
  nonce: Scalars['Int']
  receiptContractAddress?: Maybe<Scalars['String']>
  receiptCumulativeGasUsed: Scalars['Int']
  receiptEffectiveGasPrice?: Maybe<Scalars['Decimal']>
  receiptGasUsed: Scalars['Int']
  receiptRoot?: Maybe<Scalars['String']>
  receiptStatus: Scalars['Int']
  toAddress?: Maybe<Scalars['String']>
  transactionIndex: Scalars['Int']
  transactionType?: Maybe<Scalars['Int']>
  value: Scalars['Decimal']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BlockModel: ResolverTypeWrapper<BlockModel>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  ChainStatsModel: ResolverTypeWrapper<ChainStatsModel>
  Decimal: ResolverTypeWrapper<Scalars['Decimal']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  LogModel: ResolverTypeWrapper<LogModel>
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  TimeSeriesChartModel: ResolverTypeWrapper<TimeSeriesChartModel>
  TransactionModel: ResolverTypeWrapper<TransactionModel>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BlockModel: BlockModel
  Boolean: Scalars['Boolean']
  ChainStatsModel: ChainStatsModel
  Decimal: Scalars['Decimal']
  Int: Scalars['Int']
  LogModel: LogModel
  Query: {}
  String: Scalars['String']
  TimeSeriesChartModel: TimeSeriesChartModel
  TransactionModel: TransactionModel
}>

export type BlockModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BlockModel'] = ResolversParentTypes['BlockModel']
> = ResolversObject<{
  baseFeePerGas?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  difficulty?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  extraData?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  gasLimit?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  gasUsed?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  logsBloom?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  miner?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  nonce?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  parentHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  receiptsRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  sha3Uncles?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  stateRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalDifficulty?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  transactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionsRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ChainStatsModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ChainStatsModel'] = ResolversParentTypes['ChainStatsModel']
> = ResolversObject<{
  lastBlockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  liquidity24hDelta?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  liquidityUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  marketCap?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  mediumGasPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  nativeTokenPriceUsd?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  nativeTokenPriceUsd24hDelta?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  tokenSupply?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  transactionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionsCountHistory?: Resolver<
    Array<ResolversTypes['TimeSeriesChartModel']>,
    ParentType,
    ContextType
  >
  transactionsPerSecond?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  volume24hDeltaUsd?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  volume24hUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface DecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal'
}

export type LogModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LogModel'] = ResolversParentTypes['LogModel']
> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  blockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  topics?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  transactionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  blocks?: Resolver<
    Array<ResolversTypes['BlockModel']>,
    ParentType,
    ContextType,
    RequireFields<QueryBlocksArgs, 'first' | 'number' | 'skip'>
  >
  chainStats?: Resolver<
    ResolversTypes['ChainStatsModel'],
    ParentType,
    ContextType
  >
  logs?: Resolver<
    Array<ResolversTypes['LogModel']>,
    ParentType,
    ContextType,
    RequireFields<QueryLogsArgs, 'first' | 'skip' | 'transactionHash'>
  >
  transactions?: Resolver<
    Array<ResolversTypes['TransactionModel']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryTransactionsArgs,
      'blockNumber' | 'first' | 'hash' | 'skip'
    >
  >
}>

export type TimeSeriesChartModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TimeSeriesChartModel'] = ResolversParentTypes['TimeSeriesChartModel']
> = ResolversObject<{
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type TransactionModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TransactionModel'] = ResolversParentTypes['TransactionModel']
> = ResolversObject<{
  blockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  gas?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  gasPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  input?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  maxFeePerGas?: Resolver<
    Maybe<ResolversTypes['Decimal']>,
    ParentType,
    ContextType
  >
  maxPriorityFeePerGas?: Resolver<
    Maybe<ResolversTypes['Decimal']>,
    ParentType,
    ContextType
  >
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  receiptContractAddress?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  receiptCumulativeGasUsed?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >
  receiptEffectiveGasPrice?: Resolver<
    Maybe<ResolversTypes['Decimal']>,
    ParentType,
    ContextType
  >
  receiptGasUsed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  receiptRoot?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  receiptStatus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  toAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  transactionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionType?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  value?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  BlockModel?: BlockModelResolvers<ContextType>
  ChainStatsModel?: ChainStatsModelResolvers<ContextType>
  Decimal?: GraphQLScalarType
  LogModel?: LogModelResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  TimeSeriesChartModel?: TimeSeriesChartModelResolvers<ContextType>
  TransactionModel?: TransactionModelResolvers<ContextType>
}>

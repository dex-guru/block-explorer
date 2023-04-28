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

export type AddressModel = {
  __typename?: 'AddressModel'
  address: Scalars['String']
  addressType: Scalars['String']
  assetsCount: Scalars['Int']
  assetsValueUSD: Scalars['Float']
  assetsValueUSD24hDelta: Scalars['Float']
  nativeBalance: Scalars['Float']
  nativeBalanceUSD: Scalars['Float']
}

export type BlockModel = {
  __typename?: 'BlockModel'
  baseFeePerGas?: Maybe<Scalars['Decimal']>
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

export type BlockStatsModel = {
  __typename?: 'BlockStatsModel'
  burntFees: Scalars['Float']
  lastSafeBlock: Scalars['Int']
  networkUtilization24H: Scalars['Float']
}

export type ChainConfigModel = {
  __typename?: 'ChainConfigModel'
  chain: Scalars['String']
  chainId: Scalars['Int']
  explorers: Array<ExplorerModel>
  faucets: Array<Scalars['String']>
  infoURL: Scalars['String']
  name: Scalars['String']
  nativeCurrency: NativeCurrencyModel
  networkId: Scalars['Int']
  rpc: Array<Scalars['String']>
  shortName: Scalars['String']
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

export type ExplorerModel = {
  __typename?: 'ExplorerModel'
  name: Scalars['String']
  standard: Scalars['String']
  url: Scalars['String']
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

export type NativeCurrencyModel = {
  __typename?: 'NativeCurrencyModel'
  decimals: Scalars['Int']
  name: Scalars['String']
  symbol: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  /** Get address */
  address: AddressModel
  /** Get block stats */
  blockStats: BlockStatsModel
  /** Get blocks */
  blocks: Array<BlockModel>
  /** Get chain config */
  chainConfig: ChainConfigModel
  /** Get transactions */
  chainStats: ChainStatsModel
  /** Get logs */
  logs: Array<LogModel>
  /** Search Blocks/Address/Transactions/Logs */
  search: Search
  /** Get transaction stats */
  transactionStats: TransactionStatsModel
  /** Get transactions */
  transactions: Array<TransactionModel>
}

export type QueryAddressArgs = {
  address: Scalars['String']
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

export type QuerySearchArgs = {
  first: Scalars['Int']
  query: Scalars['String']
  skip?: Scalars['Int']
}

export type QueryTransactionsArgs = {
  address?: InputMaybe<Scalars['String']>
  blockNumber?: InputMaybe<Scalars['Int']>
  first: Scalars['Int']
  hash?: InputMaybe<Scalars['String']>
  skip?: Scalars['Int']
}

export type Search = {
  __typename?: 'Search'
  addresses?: Maybe<Array<AddressModel>>
  blocks?: Maybe<Array<BlockModel>>
  query: Scalars['String']
  transactions?: Maybe<Array<TransactionModel>>
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
  gas: Scalars['Decimal']
  gasPrice: Scalars['Decimal']
  hash: Scalars['String']
  input: Scalars['String']
  maxFeePerGas?: Maybe<Scalars['Decimal']>
  maxPriorityFeePerGas?: Maybe<Scalars['Decimal']>
  nonce: Scalars['Int']
  receiptContractAddress?: Maybe<Scalars['String']>
  receiptCumulativeGasUsed: Scalars['Decimal']
  receiptEffectiveGasPrice?: Maybe<Scalars['Decimal']>
  receiptGasUsed: Scalars['Decimal']
  receiptRoot?: Maybe<Scalars['String']>
  receiptStatus: Scalars['Int']
  toAddress?: Maybe<Scalars['String']>
  transactionIndex: Scalars['Int']
  transactionType?: Maybe<Scalars['Int']>
  value: Scalars['Decimal']
}

export type TransactionStatsModel = {
  __typename?: 'TransactionStatsModel'
  networkTransactionsFee24H: Scalars['Decimal']
  networkTransactionsFeeDelta24H: Scalars['Float']
  transactions24H: Scalars['Int']
  transactionsDelta24H: Scalars['Float']
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
  AddressModel: ResolverTypeWrapper<AddressModel>
  BlockModel: ResolverTypeWrapper<BlockModel>
  BlockStatsModel: ResolverTypeWrapper<BlockStatsModel>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  ChainConfigModel: ResolverTypeWrapper<ChainConfigModel>
  ChainStatsModel: ResolverTypeWrapper<ChainStatsModel>
  Decimal: ResolverTypeWrapper<Scalars['Decimal']>
  ExplorerModel: ResolverTypeWrapper<ExplorerModel>
  Float: ResolverTypeWrapper<Scalars['Float']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  LogModel: ResolverTypeWrapper<LogModel>
  NativeCurrencyModel: ResolverTypeWrapper<NativeCurrencyModel>
  Query: ResolverTypeWrapper<{}>
  Search: ResolverTypeWrapper<Search>
  String: ResolverTypeWrapper<Scalars['String']>
  TimeSeriesChartModel: ResolverTypeWrapper<TimeSeriesChartModel>
  TransactionModel: ResolverTypeWrapper<TransactionModel>
  TransactionStatsModel: ResolverTypeWrapper<TransactionStatsModel>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddressModel: AddressModel
  BlockModel: BlockModel
  BlockStatsModel: BlockStatsModel
  Boolean: Scalars['Boolean']
  ChainConfigModel: ChainConfigModel
  ChainStatsModel: ChainStatsModel
  Decimal: Scalars['Decimal']
  ExplorerModel: ExplorerModel
  Float: Scalars['Float']
  Int: Scalars['Int']
  LogModel: LogModel
  NativeCurrencyModel: NativeCurrencyModel
  Query: {}
  Search: Search
  String: Scalars['String']
  TimeSeriesChartModel: TimeSeriesChartModel
  TransactionModel: TransactionModel
  TransactionStatsModel: TransactionStatsModel
}>

export type AddressModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AddressModel'] = ResolversParentTypes['AddressModel']
> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  addressType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  assetsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  assetsValueUSD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  assetsValueUSD24hDelta?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >
  nativeBalance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  nativeBalanceUSD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BlockModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BlockModel'] = ResolversParentTypes['BlockModel']
> = ResolversObject<{
  baseFeePerGas?: Resolver<
    Maybe<ResolversTypes['Decimal']>,
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

export type BlockStatsModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BlockStatsModel'] = ResolversParentTypes['BlockStatsModel']
> = ResolversObject<{
  burntFees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  lastSafeBlock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  networkUtilization24H?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ChainConfigModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ChainConfigModel'] = ResolversParentTypes['ChainConfigModel']
> = ResolversObject<{
  chain?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  explorers?: Resolver<
    Array<ResolversTypes['ExplorerModel']>,
    ParentType,
    ContextType
  >
  faucets?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  infoURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  nativeCurrency?: Resolver<
    ResolversTypes['NativeCurrencyModel'],
    ParentType,
    ContextType
  >
  networkId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  rpc?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  shortName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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

export type ExplorerModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ExplorerModel'] = ResolversParentTypes['ExplorerModel']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  standard?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

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

export type NativeCurrencyModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NativeCurrencyModel'] = ResolversParentTypes['NativeCurrencyModel']
> = ResolversObject<{
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  address?: Resolver<
    ResolversTypes['AddressModel'],
    ParentType,
    ContextType,
    RequireFields<QueryAddressArgs, 'address'>
  >
  blockStats?: Resolver<
    ResolversTypes['BlockStatsModel'],
    ParentType,
    ContextType
  >
  blocks?: Resolver<
    Array<ResolversTypes['BlockModel']>,
    ParentType,
    ContextType,
    RequireFields<QueryBlocksArgs, 'first' | 'number' | 'skip'>
  >
  chainConfig?: Resolver<
    ResolversTypes['ChainConfigModel'],
    ParentType,
    ContextType
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
  search?: Resolver<
    ResolversTypes['Search'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, 'first' | 'query' | 'skip'>
  >
  transactionStats?: Resolver<
    ResolversTypes['TransactionStatsModel'],
    ParentType,
    ContextType
  >
  transactions?: Resolver<
    Array<ResolversTypes['TransactionModel']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryTransactionsArgs,
      'address' | 'blockNumber' | 'first' | 'hash' | 'skip'
    >
  >
}>

export type SearchResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Search'] = ResolversParentTypes['Search']
> = ResolversObject<{
  addresses?: Resolver<
    Maybe<Array<ResolversTypes['AddressModel']>>,
    ParentType,
    ContextType
  >
  blocks?: Resolver<
    Maybe<Array<ResolversTypes['BlockModel']>>,
    ParentType,
    ContextType
  >
  query?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  transactions?: Resolver<
    Maybe<Array<ResolversTypes['TransactionModel']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  gas?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
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
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  receiptEffectiveGasPrice?: Resolver<
    Maybe<ResolversTypes['Decimal']>,
    ParentType,
    ContextType
  >
  receiptGasUsed?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>
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

export type TransactionStatsModelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TransactionStatsModel'] = ResolversParentTypes['TransactionStatsModel']
> = ResolversObject<{
  networkTransactionsFee24H?: Resolver<
    ResolversTypes['Decimal'],
    ParentType,
    ContextType
  >
  networkTransactionsFeeDelta24H?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >
  transactions24H?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionsDelta24H?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  AddressModel?: AddressModelResolvers<ContextType>
  BlockModel?: BlockModelResolvers<ContextType>
  BlockStatsModel?: BlockStatsModelResolvers<ContextType>
  ChainConfigModel?: ChainConfigModelResolvers<ContextType>
  ChainStatsModel?: ChainStatsModelResolvers<ContextType>
  Decimal?: GraphQLScalarType
  ExplorerModel?: ExplorerModelResolvers<ContextType>
  LogModel?: LogModelResolvers<ContextType>
  NativeCurrencyModel?: NativeCurrencyModelResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Search?: SearchResolvers<ContextType>
  TimeSeriesChartModel?: TimeSeriesChartModelResolvers<ContextType>
  TransactionModel?: TransactionModelResolvers<ContextType>
  TransactionStatsModel?: TransactionStatsModelResolvers<ContextType>
}>

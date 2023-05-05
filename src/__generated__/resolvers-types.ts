import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Decimal: any;
};

export type AddressModel = {
  __typename?: 'AddressModel';
  address: Scalars['String'];
  addressType: Scalars['String'];
  assetsCount: Scalars['Int'];
  assetsValueUSD: Scalars['Float'];
  assetsValueUSD24hDelta: Scalars['Float'];
  nativeBalance: Scalars['Float'];
  nativeBalanceUSD: Scalars['Float'];
};

export type BlockModel = {
  __typename?: 'BlockModel';
  baseFeePerGas?: Maybe<Scalars['Decimal']>;
  difficulty: Scalars['Decimal'];
  extraData: Scalars['String'];
  gasLimit: Scalars['Decimal'];
  gasUsed: Scalars['Decimal'];
  hash: Scalars['String'];
  logsBloom: Scalars['String'];
  miner: Scalars['String'];
  nonce: Scalars['String'];
  number: Scalars['Int'];
  parentHash: Scalars['String'];
  receiptsRoot: Scalars['String'];
  sha3Uncles: Scalars['String'];
  size: Scalars['Int'];
  stateRoot: Scalars['String'];
  timestamp: Scalars['Int'];
  totalDifficulty: Scalars['Decimal'];
  transactionCount: Scalars['Int'];
  transactionsRoot: Scalars['String'];
};

export type BlockStatsModel = {
  __typename?: 'BlockStatsModel';
  blocksCount: Scalars['Int'];
  burntFees: Scalars['Float'];
  lastSafeBlock: Scalars['Int'];
  networkUtilization24H: Scalars['Float'];
};

export type CsrStatsModel = {
  __typename?: 'CSRStatsModel';
  burned: Array<TimeSeriesChartModel>;
  netEmissions: Array<TimeSeriesChartModel>;
  sumContracts: Scalars['Int'];
  sumRevenue: Scalars['Decimal'];
  sumTx: Scalars['Int'];
};

export type ChainConfigModel = {
  __typename?: 'ChainConfigModel';
  chain: Scalars['String'];
  chainId: Scalars['Int'];
  explorers: Array<ExplorerModel>;
  faucets: Array<Scalars['String']>;
  infoURL: Scalars['String'];
  name: Scalars['String'];
  nativeCurrency: NativeCurrencyModel;
  networkId: Scalars['Int'];
  rpc: Array<Scalars['String']>;
  shortName: Scalars['String'];
};

export type ChainStatsModel = {
  __typename?: 'ChainStatsModel';
  lastBlockNumber: Scalars['Int'];
  liquidity24hDelta: Scalars['Decimal'];
  liquidityUsd: Scalars['Decimal'];
  marketCap: Scalars['Decimal'];
  mediumGasPrice: Scalars['Decimal'];
  nativeTokenPriceUsd: Scalars['Decimal'];
  nativeTokenPriceUsd24hDelta: Scalars['Decimal'];
  tokenSupply: Scalars['Decimal'];
  transactionsCount: Scalars['Int'];
  transactionsCountHistory: Array<TimeSeriesChartModel>;
  transactionsPerSecond: Scalars['Decimal'];
  volume24hDeltaUsd: Scalars['Decimal'];
  volume24hUsd: Scalars['Decimal'];
};

export type ContractCreatorModel = {
  __typename?: 'ContractCreatorModel';
  creatorAddress: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type CosmosBlockModel = {
  __typename?: 'CosmosBlockModel';
  blockNumber: Scalars['Int'];
  blockSize: Scalars['Int'];
  blockTimestamp: Scalars['Int'];
  hash: Scalars['String'];
  proposerAddress: Scalars['String'];
  transactionCount: Scalars['Int'];
};

export type CosmosModel = {
  __typename?: 'CosmosModel';
  blocks: Array<CosmosBlockModel>;
  transactions: Array<CosmosTransactionModel>;
};

export type CosmosTransactionModel = {
  __typename?: 'CosmosTransactionModel';
  blockNumber: Scalars['Int'];
  blockTimestamp: Scalars['Int'];
  hash: Scalars['String'];
};

export type DecodedInputModel = {
  __typename?: 'DecodedInputModel';
  isIndexed: Scalars['Boolean'];
  name: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Erc20EventModel = {
  __typename?: 'ERC20EventModel';
  amounts: Array<Scalars['Decimal']>;
  blockTimestamp: Scalars['Int'];
  eventType: Scalars['String'];
  fromAddress: Scalars['String'];
  hash: Scalars['String'];
  toAddress: Scalars['String'];
  tokenAddresses: Array<Scalars['String']>;
  tokenSymbols: Array<Scalars['String']>;
};

export type Erc20EventsModel = {
  __typename?: 'ERC20EventsModel';
  data: Array<Erc20EventModel>;
  total: Scalars['Int'];
};

export type Erc721TransferModel = {
  __typename?: 'ERC721TransferModel';
  blockTimestamp: Scalars['Int'];
  fromAddress: Scalars['String'];
  hash: Scalars['String'];
  operatorAddress?: Maybe<Scalars['String']>;
  toAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
  tokenId: Scalars['Int'];
  value?: Maybe<Scalars['Decimal']>;
};

export type ExplorerModel = {
  __typename?: 'ExplorerModel';
  name: Scalars['String'];
  standard: Scalars['String'];
  url: Scalars['String'];
};

export type LogModel = {
  __typename?: 'LogModel';
  address: Scalars['String'];
  blockHash: Scalars['String'];
  blockNumber: Scalars['Int'];
  data: Scalars['String'];
  decodedInput?: Maybe<Array<DecodedInputModel>>;
  eventName?: Maybe<Scalars['String']>;
  logIndex: Scalars['Int'];
  topics: Array<Scalars['String']>;
  transactionHash: Scalars['String'];
  transactionIndex: Scalars['Int'];
};

export type NftTransfersModel = {
  __typename?: 'NFTTransfersModel';
  data: Array<Erc721TransferModel>;
  total: Scalars['Int'];
};

export type NativeCurrencyModel = {
  __typename?: 'NativeCurrencyModel';
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Get address */
  address: AddressModel;
  /** Get token stats */
  balancesStats?: Maybe<TokenBalancesStatsModel>;
  /** Get block stats */
  blockStats: BlockStatsModel;
  /** Get blocks */
  blocks: Array<BlockModel>;
  /** Get chain config */
  chainConfig: ChainConfigModel;
  /** Get transactions */
  chainStats: ChainStatsModel;
  /** Contract creator */
  contractCreator?: Maybe<ContractCreatorModel>;
  /** Get last cosmos blocks and/or transactions */
  cosmos: CosmosModel;
  /** Get CSRStats */
  csrStats: CsrStatsModel;
  /** Get ERC20 Transactions */
  erc20Events: Erc20EventsModel;
  /** Get logs */
  logs: Array<LogModel>;
  /** Get ERC721 and ERC1155 Transfers */
  nftEvents: NftTransfersModel;
  /** Search Blocks/Address/Transactions/Logs */
  search: Search;
  /** Get tokens holdings for address */
  tokenHoldings: Array<TokenHoldingsModel>;
  /** Get total stats for token holdings */
  tokenHoldingsStats?: Maybe<TokenHoldingsStatsModel>;
  /** Get traces for a transaction */
  traces: TransactionTraceModel;
  /** Get transaction stats */
  transactionStats: TransactionStatsModel;
  /** Get transactions */
  transactions: Array<TransactionModel>;
};


export type QueryAddressArgs = {
  address: Scalars['String'];
};


export type QueryBalancesStatsArgs = {
  tokenAddress: Scalars['String'];
};


export type QueryBlockStatsArgs = {
  blockNumberEnd?: InputMaybe<Scalars['Int']>;
  blockNumberStart?: InputMaybe<Scalars['Int']>;
  timestampEnd?: InputMaybe<Scalars['Int']>;
  timestampStart?: InputMaybe<Scalars['Int']>;
};


export type QueryBlocksArgs = {
  blockNumberEnd?: InputMaybe<Scalars['Int']>;
  blockNumberStart?: InputMaybe<Scalars['Int']>;
  first?: Scalars['Int'];
  number?: InputMaybe<Scalars['Int']>;
  skip?: Scalars['Int'];
  timestampEnd?: InputMaybe<Scalars['Int']>;
  timestampStart?: InputMaybe<Scalars['Int']>;
};


export type QueryContractCreatorArgs = {
  address: Scalars['String'];
};


export type QueryErc20EventsArgs = {
  address?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hash?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  walletAddress?: InputMaybe<Scalars['String']>;
};


export type QueryLogsArgs = {
  address?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  transactionHash?: InputMaybe<Scalars['String']>;
};


export type QueryNftEventsArgs = {
  address?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hash?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QuerySearchArgs = {
  first: Scalars['Int'];
  query: Scalars['String'];
  skip?: Scalars['Int'];
};


export type QueryTokenHoldingsArgs = {
  address: Scalars['String'];
  first?: Scalars['Int'];
  skip?: Scalars['Int'];
};


export type QueryTokenHoldingsStatsArgs = {
  address: Scalars['String'];
};


export type QueryTracesArgs = {
  txHash: Scalars['String'];
};


export type QueryTransactionStatsArgs = {
  address?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  blockNumberEnd?: InputMaybe<Scalars['Int']>;
  blockNumberStart?: InputMaybe<Scalars['Int']>;
  timestampEnd?: InputMaybe<Scalars['Int']>;
  timestampStart?: InputMaybe<Scalars['Int']>;
};


export type QueryTransactionsArgs = {
  address?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  blockNumberEnd?: InputMaybe<Scalars['Int']>;
  blockNumberStart?: InputMaybe<Scalars['Int']>;
  first?: Scalars['Int'];
  hash?: InputMaybe<Scalars['String']>;
  skip?: Scalars['Int'];
  timestampEnd?: InputMaybe<Scalars['Int']>;
  timestampStart?: InputMaybe<Scalars['Int']>;
};

export type Search = {
  __typename?: 'Search';
  addresses: Array<AddressModel>;
  blocks: Array<BlockModel>;
  query: Scalars['String'];
  transactions: Array<TransactionModel>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newBlock: BlockModel;
  newTransaction: TransactionModel;
};

export type TimeSeriesChartModel = {
  __typename?: 'TimeSeriesChartModel';
  timestamp: Scalars['Int'];
  value: Scalars['Float'];
};

export type TokenBalancesStatsModel = {
  __typename?: 'TokenBalancesStatsModel';
  fullyDilutedValuation?: Maybe<Scalars['Float']>;
  holders?: Maybe<Scalars['Int']>;
  holdersChange?: Maybe<Scalars['Float']>;
  holdersChart: Array<TimeSeriesChartModel>;
  maxTotalSupply?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  priceChange?: Maybe<Scalars['Float']>;
  totalTransfers?: Maybe<Scalars['Int']>;
};

export type TokenHoldingsModel = {
  __typename?: 'TokenHoldingsModel';
  asset: Scalars['String'];
  change24H: Scalars['Float'];
  contractAddress: Scalars['String'];
  logo: Array<Scalars['String']>;
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  symbol: Array<Scalars['String']>;
  value: Scalars['Float'];
};

export type TokenHoldingsStatsModel = {
  __typename?: 'TokenHoldingsStatsModel';
  change24H: Scalars['Float'];
  tokenCount: Scalars['Int'];
  totalNative: Scalars['String'];
  totalStable: Scalars['String'];
};

export type TransactionModel = {
  __typename?: 'TransactionModel';
  blockHash: Scalars['String'];
  blockNumber: Scalars['Int'];
  blockTimestamp: Scalars['Int'];
  fromAddress: Scalars['String'];
  gas: Scalars['Decimal'];
  gasPrice: Scalars['Decimal'];
  hash: Scalars['String'];
  input: Scalars['String'];
  maxFeePerGas?: Maybe<Scalars['Decimal']>;
  maxPriorityFeePerGas?: Maybe<Scalars['Decimal']>;
  nonce: Scalars['Int'];
  receiptContractAddress?: Maybe<Scalars['String']>;
  receiptCumulativeGasUsed: Scalars['Decimal'];
  receiptEffectiveGasPrice?: Maybe<Scalars['Decimal']>;
  receiptGasUsed: Scalars['Decimal'];
  receiptRoot?: Maybe<Scalars['String']>;
  receiptStatus: Scalars['Int'];
  toAddress?: Maybe<Scalars['String']>;
  transactionIndex: Scalars['Int'];
  transactionType?: Maybe<Scalars['Int']>;
  value: Scalars['Decimal'];
};

export type TransactionStatsModel = {
  __typename?: 'TransactionStatsModel';
  networkTransactionsFee24H: Scalars['Decimal'];
  networkTransactionsFeeDelta24H: Scalars['Float'];
  transactions24H: Scalars['Int'];
  transactionsCount: Scalars['Int'];
  transactionsDelta24H: Scalars['Float'];
};

export type TransactionTraceModel = {
  __typename?: 'TransactionTraceModel';
  tracesJSON: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddressModel: ResolverTypeWrapper<AddressModel>;
  BlockModel: ResolverTypeWrapper<BlockModel>;
  BlockStatsModel: ResolverTypeWrapper<BlockStatsModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CSRStatsModel: ResolverTypeWrapper<CsrStatsModel>;
  ChainConfigModel: ResolverTypeWrapper<ChainConfigModel>;
  ChainStatsModel: ResolverTypeWrapper<ChainStatsModel>;
  ContractCreatorModel: ResolverTypeWrapper<ContractCreatorModel>;
  CosmosBlockModel: ResolverTypeWrapper<CosmosBlockModel>;
  CosmosModel: ResolverTypeWrapper<CosmosModel>;
  CosmosTransactionModel: ResolverTypeWrapper<CosmosTransactionModel>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']>;
  DecodedInputModel: ResolverTypeWrapper<DecodedInputModel>;
  ERC20EventModel: ResolverTypeWrapper<Erc20EventModel>;
  ERC20EventsModel: ResolverTypeWrapper<Erc20EventsModel>;
  ERC721TransferModel: ResolverTypeWrapper<Erc721TransferModel>;
  ExplorerModel: ResolverTypeWrapper<ExplorerModel>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LogModel: ResolverTypeWrapper<LogModel>;
  NFTTransfersModel: ResolverTypeWrapper<NftTransfersModel>;
  NativeCurrencyModel: ResolverTypeWrapper<NativeCurrencyModel>;
  Query: ResolverTypeWrapper<{}>;
  Search: ResolverTypeWrapper<Search>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  TimeSeriesChartModel: ResolverTypeWrapper<TimeSeriesChartModel>;
  TokenBalancesStatsModel: ResolverTypeWrapper<TokenBalancesStatsModel>;
  TokenHoldingsModel: ResolverTypeWrapper<TokenHoldingsModel>;
  TokenHoldingsStatsModel: ResolverTypeWrapper<TokenHoldingsStatsModel>;
  TransactionModel: ResolverTypeWrapper<TransactionModel>;
  TransactionStatsModel: ResolverTypeWrapper<TransactionStatsModel>;
  TransactionTraceModel: ResolverTypeWrapper<TransactionTraceModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddressModel: AddressModel;
  BlockModel: BlockModel;
  BlockStatsModel: BlockStatsModel;
  Boolean: Scalars['Boolean'];
  CSRStatsModel: CsrStatsModel;
  ChainConfigModel: ChainConfigModel;
  ChainStatsModel: ChainStatsModel;
  ContractCreatorModel: ContractCreatorModel;
  CosmosBlockModel: CosmosBlockModel;
  CosmosModel: CosmosModel;
  CosmosTransactionModel: CosmosTransactionModel;
  Decimal: Scalars['Decimal'];
  DecodedInputModel: DecodedInputModel;
  ERC20EventModel: Erc20EventModel;
  ERC20EventsModel: Erc20EventsModel;
  ERC721TransferModel: Erc721TransferModel;
  ExplorerModel: ExplorerModel;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  LogModel: LogModel;
  NFTTransfersModel: NftTransfersModel;
  NativeCurrencyModel: NativeCurrencyModel;
  Query: {};
  Search: Search;
  String: Scalars['String'];
  Subscription: {};
  TimeSeriesChartModel: TimeSeriesChartModel;
  TokenBalancesStatsModel: TokenBalancesStatsModel;
  TokenHoldingsModel: TokenHoldingsModel;
  TokenHoldingsStatsModel: TokenHoldingsStatsModel;
  TransactionModel: TransactionModel;
  TransactionStatsModel: TransactionStatsModel;
  TransactionTraceModel: TransactionTraceModel;
}>;

export type AddressModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressModel'] = ResolversParentTypes['AddressModel']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assetsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  assetsValueUSD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  assetsValueUSD24hDelta?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nativeBalance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nativeBalanceUSD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlockModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockModel'] = ResolversParentTypes['BlockModel']> = ResolversObject<{
  baseFeePerGas?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  difficulty?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  extraData?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gasLimit?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  gasUsed?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logsBloom?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  miner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parentHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  receiptsRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sha3Uncles?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stateRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDifficulty?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionsRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlockStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockStatsModel'] = ResolversParentTypes['BlockStatsModel']> = ResolversObject<{
  blocksCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  burntFees?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastSafeBlock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  networkUtilization24H?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CsrStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['CSRStatsModel'] = ResolversParentTypes['CSRStatsModel']> = ResolversObject<{
  burned?: Resolver<Array<ResolversTypes['TimeSeriesChartModel']>, ParentType, ContextType>;
  netEmissions?: Resolver<Array<ResolversTypes['TimeSeriesChartModel']>, ParentType, ContextType>;
  sumContracts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sumRevenue?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  sumTx?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChainConfigModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChainConfigModel'] = ResolversParentTypes['ChainConfigModel']> = ResolversObject<{
  chain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  explorers?: Resolver<Array<ResolversTypes['ExplorerModel']>, ParentType, ContextType>;
  faucets?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  infoURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nativeCurrency?: Resolver<ResolversTypes['NativeCurrencyModel'], ParentType, ContextType>;
  networkId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rpc?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  shortName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChainStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChainStatsModel'] = ResolversParentTypes['ChainStatsModel']> = ResolversObject<{
  lastBlockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  liquidity24hDelta?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  liquidityUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  marketCap?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  mediumGasPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  nativeTokenPriceUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  nativeTokenPriceUsd24hDelta?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  tokenSupply?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  transactionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionsCountHistory?: Resolver<Array<ResolversTypes['TimeSeriesChartModel']>, ParentType, ContextType>;
  transactionsPerSecond?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  volume24hDeltaUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  volume24hUsd?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractCreatorModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContractCreatorModel'] = ResolversParentTypes['ContractCreatorModel']> = ResolversObject<{
  creatorAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CosmosBlockModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['CosmosBlockModel'] = ResolversParentTypes['CosmosBlockModel']> = ResolversObject<{
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blockSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CosmosModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['CosmosModel'] = ResolversParentTypes['CosmosModel']> = ResolversObject<{
  blocks?: Resolver<Array<ResolversTypes['CosmosBlockModel']>, ParentType, ContextType>;
  transactions?: Resolver<Array<ResolversTypes['CosmosTransactionModel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CosmosTransactionModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['CosmosTransactionModel'] = ResolversParentTypes['CosmosTransactionModel']> = ResolversObject<{
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type DecodedInputModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['DecodedInputModel'] = ResolversParentTypes['DecodedInputModel']> = ResolversObject<{
  isIndexed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Erc20EventModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ERC20EventModel'] = ResolversParentTypes['ERC20EventModel']> = ResolversObject<{
  amounts?: Resolver<Array<ResolversTypes['Decimal']>, ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  eventType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenAddresses?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  tokenSymbols?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Erc20EventsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ERC20EventsModel'] = ResolversParentTypes['ERC20EventsModel']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['ERC20EventModel']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Erc721TransferModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ERC721TransferModel'] = ResolversParentTypes['ERC721TransferModel']> = ResolversObject<{
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operatorAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  toAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExplorerModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExplorerModel'] = ResolversParentTypes['ExplorerModel']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  standard?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogModel'] = ResolversParentTypes['LogModel']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decodedInput?: Resolver<Maybe<Array<ResolversTypes['DecodedInputModel']>>, ParentType, ContextType>;
  eventName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NftTransfersModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['NFTTransfersModel'] = ResolversParentTypes['NFTTransfersModel']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['ERC721TransferModel']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NativeCurrencyModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['NativeCurrencyModel'] = ResolversParentTypes['NativeCurrencyModel']> = ResolversObject<{
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  address?: Resolver<ResolversTypes['AddressModel'], ParentType, ContextType, RequireFields<QueryAddressArgs, 'address'>>;
  balancesStats?: Resolver<Maybe<ResolversTypes['TokenBalancesStatsModel']>, ParentType, ContextType, RequireFields<QueryBalancesStatsArgs, 'tokenAddress'>>;
  blockStats?: Resolver<ResolversTypes['BlockStatsModel'], ParentType, ContextType, RequireFields<QueryBlockStatsArgs, 'blockNumberEnd' | 'blockNumberStart' | 'timestampEnd' | 'timestampStart'>>;
  blocks?: Resolver<Array<ResolversTypes['BlockModel']>, ParentType, ContextType, RequireFields<QueryBlocksArgs, 'blockNumberEnd' | 'blockNumberStart' | 'first' | 'number' | 'skip' | 'timestampEnd' | 'timestampStart'>>;
  chainConfig?: Resolver<ResolversTypes['ChainConfigModel'], ParentType, ContextType>;
  chainStats?: Resolver<ResolversTypes['ChainStatsModel'], ParentType, ContextType>;
  contractCreator?: Resolver<Maybe<ResolversTypes['ContractCreatorModel']>, ParentType, ContextType, RequireFields<QueryContractCreatorArgs, 'address'>>;
  cosmos?: Resolver<ResolversTypes['CosmosModel'], ParentType, ContextType>;
  csrStats?: Resolver<ResolversTypes['CSRStatsModel'], ParentType, ContextType>;
  erc20Events?: Resolver<ResolversTypes['ERC20EventsModel'], ParentType, ContextType, RequireFields<QueryErc20EventsArgs, 'address' | 'first' | 'hash' | 'skip' | 'walletAddress'>>;
  logs?: Resolver<Array<ResolversTypes['LogModel']>, ParentType, ContextType, RequireFields<QueryLogsArgs, 'address' | 'first' | 'skip' | 'transactionHash'>>;
  nftEvents?: Resolver<ResolversTypes['NFTTransfersModel'], ParentType, ContextType, RequireFields<QueryNftEventsArgs, 'address' | 'first' | 'hash' | 'skip'>>;
  search?: Resolver<ResolversTypes['Search'], ParentType, ContextType, RequireFields<QuerySearchArgs, 'first' | 'query' | 'skip'>>;
  tokenHoldings?: Resolver<Array<ResolversTypes['TokenHoldingsModel']>, ParentType, ContextType, RequireFields<QueryTokenHoldingsArgs, 'address' | 'first' | 'skip'>>;
  tokenHoldingsStats?: Resolver<Maybe<ResolversTypes['TokenHoldingsStatsModel']>, ParentType, ContextType, RequireFields<QueryTokenHoldingsStatsArgs, 'address'>>;
  traces?: Resolver<ResolversTypes['TransactionTraceModel'], ParentType, ContextType, RequireFields<QueryTracesArgs, 'txHash'>>;
  transactionStats?: Resolver<ResolversTypes['TransactionStatsModel'], ParentType, ContextType, RequireFields<QueryTransactionStatsArgs, 'address' | 'blockNumber' | 'blockNumberEnd' | 'blockNumberStart' | 'timestampEnd' | 'timestampStart'>>;
  transactions?: Resolver<Array<ResolversTypes['TransactionModel']>, ParentType, ContextType, RequireFields<QueryTransactionsArgs, 'address' | 'blockNumber' | 'blockNumberEnd' | 'blockNumberStart' | 'first' | 'hash' | 'skip' | 'timestampEnd' | 'timestampStart'>>;
}>;

export type SearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Search'] = ResolversParentTypes['Search']> = ResolversObject<{
  addresses?: Resolver<Array<ResolversTypes['AddressModel']>, ParentType, ContextType>;
  blocks?: Resolver<Array<ResolversTypes['BlockModel']>, ParentType, ContextType>;
  query?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactions?: Resolver<Array<ResolversTypes['TransactionModel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  newBlock?: SubscriptionResolver<ResolversTypes['BlockModel'], "newBlock", ParentType, ContextType>;
  newTransaction?: SubscriptionResolver<ResolversTypes['TransactionModel'], "newTransaction", ParentType, ContextType>;
}>;

export type TimeSeriesChartModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeSeriesChartModel'] = ResolversParentTypes['TimeSeriesChartModel']> = ResolversObject<{
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenBalancesStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenBalancesStatsModel'] = ResolversParentTypes['TokenBalancesStatsModel']> = ResolversObject<{
  fullyDilutedValuation?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  holders?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  holdersChange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  holdersChart?: Resolver<Array<ResolversTypes['TimeSeriesChartModel']>, ParentType, ContextType>;
  maxTotalSupply?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  priceChange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalTransfers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenHoldingsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenHoldingsModel'] = ResolversParentTypes['TokenHoldingsModel']> = ResolversObject<{
  asset?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  change24H?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logo?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  symbol?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenHoldingsStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenHoldingsStatsModel'] = ResolversParentTypes['TokenHoldingsStatsModel']> = ResolversObject<{
  change24H?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalNative?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalStable?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionModel'] = ResolversParentTypes['TransactionModel']> = ResolversObject<{
  blockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gas?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  input?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxFeePerGas?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  maxPriorityFeePerGas?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  receiptContractAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  receiptCumulativeGasUsed?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  receiptEffectiveGasPrice?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  receiptGasUsed?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  receiptRoot?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  receiptStatus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transactionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionType?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionStatsModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionStatsModel'] = ResolversParentTypes['TransactionStatsModel']> = ResolversObject<{
  networkTransactionsFee24H?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  networkTransactionsFeeDelta24H?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  transactions24H?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionsDelta24H?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionTraceModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionTraceModel'] = ResolversParentTypes['TransactionTraceModel']> = ResolversObject<{
  tracesJSON?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AddressModel?: AddressModelResolvers<ContextType>;
  BlockModel?: BlockModelResolvers<ContextType>;
  BlockStatsModel?: BlockStatsModelResolvers<ContextType>;
  CSRStatsModel?: CsrStatsModelResolvers<ContextType>;
  ChainConfigModel?: ChainConfigModelResolvers<ContextType>;
  ChainStatsModel?: ChainStatsModelResolvers<ContextType>;
  ContractCreatorModel?: ContractCreatorModelResolvers<ContextType>;
  CosmosBlockModel?: CosmosBlockModelResolvers<ContextType>;
  CosmosModel?: CosmosModelResolvers<ContextType>;
  CosmosTransactionModel?: CosmosTransactionModelResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  DecodedInputModel?: DecodedInputModelResolvers<ContextType>;
  ERC20EventModel?: Erc20EventModelResolvers<ContextType>;
  ERC20EventsModel?: Erc20EventsModelResolvers<ContextType>;
  ERC721TransferModel?: Erc721TransferModelResolvers<ContextType>;
  ExplorerModel?: ExplorerModelResolvers<ContextType>;
  LogModel?: LogModelResolvers<ContextType>;
  NFTTransfersModel?: NftTransfersModelResolvers<ContextType>;
  NativeCurrencyModel?: NativeCurrencyModelResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Search?: SearchResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TimeSeriesChartModel?: TimeSeriesChartModelResolvers<ContextType>;
  TokenBalancesStatsModel?: TokenBalancesStatsModelResolvers<ContextType>;
  TokenHoldingsModel?: TokenHoldingsModelResolvers<ContextType>;
  TokenHoldingsStatsModel?: TokenHoldingsStatsModelResolvers<ContextType>;
  TransactionModel?: TransactionModelResolvers<ContextType>;
  TransactionStatsModel?: TransactionStatsModelResolvers<ContextType>;
  TransactionTraceModel?: TransactionTraceModelResolvers<ContextType>;
}>;


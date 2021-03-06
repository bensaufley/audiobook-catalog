// Generated file. Do not edit!

import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { IPicture } from 'music-metadata';

import type * as SchemaTypes from '~graphql/schema.generated';
import type { ApolloContext } from '~server/graphql/types';
import type {
  AudiobookAuthorDbObject,
  AudiobookDbObject,
  AuthorDbObject,
  GenreDbObject,
  ImportDbObject,
  UserDbObject,
} from '~server/mongoTypes';

export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> };
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
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

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => SchemaTypes.Maybe<TTypes> | Promise<SchemaTypes.Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  CoverImage: ResolverTypeWrapper<IPicture>;
  Audiobook: ResolverTypeWrapper<AudiobookDbObject>;
  ID: ResolverTypeWrapper<SchemaTypes.Scalars['ID']>;
  Float: ResolverTypeWrapper<SchemaTypes.Scalars['Float']>;
  String: ResolverTypeWrapper<SchemaTypes.Scalars['String']>;
  Int: ResolverTypeWrapper<SchemaTypes.Scalars['Int']>;
  AudiobookAuthor: ResolverTypeWrapper<AudiobookAuthorDbObject>;
  Author: ResolverTypeWrapper<AuthorDbObject>;
  Genre: ResolverTypeWrapper<GenreDbObject>;
  ImportStatus: ResolverTypeWrapper<string>;
  Import: ResolverTypeWrapper<ImportDbObject>;
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<UserDbObject>;
  Date: ResolverTypeWrapper<number>;
  Boolean: ResolverTypeWrapper<SchemaTypes.Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CoverImage: IPicture;
  Audiobook: AudiobookDbObject;
  ID: SchemaTypes.Scalars['ID'];
  Float: SchemaTypes.Scalars['Float'];
  String: SchemaTypes.Scalars['String'];
  Int: SchemaTypes.Scalars['Int'];
  AudiobookAuthor: AudiobookAuthorDbObject;
  Author: AuthorDbObject;
  Genre: GenreDbObject;
  Import: ImportDbObject;
  Query: {};
  User: UserDbObject;
  Date: number;
  Boolean: SchemaTypes.Scalars['Boolean'];
}>;

export interface CoverImageScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['CoverImage'], any> {
  name: 'CoverImage';
}

export type AudiobookResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['Audiobook'] = ResolversParentTypes['Audiobook']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  authors: Resolver<Array<ResolversTypes['AudiobookAuthor']>, ParentType, ContextType>;
  cover: Resolver<SchemaTypes.Maybe<ResolversTypes['CoverImage']>, ParentType, ContextType>;
  duration: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  filename: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  genres: Resolver<Array<ResolversTypes['Genre']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year: Resolver<SchemaTypes.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AudiobookAuthorResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['AudiobookAuthor'] = ResolversParentTypes['AudiobookAuthor']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  audiobook: Resolver<ResolversTypes['Audiobook'], ParentType, ContextType>;
  author: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  meta: Resolver<SchemaTypes.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  audiobooks: Resolver<Array<ResolversTypes['AudiobookAuthor']>, ParentType, ContextType>;
  firstName: Resolver<SchemaTypes.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenreResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImportStatusResolvers = EnumResolverSignature<
  { CONFLICT: any; PENDING: any; ERROR: any; DONE: any },
  ResolversTypes['ImportStatus']
>;

export type ImportResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['Import'] = ResolversParentTypes['Import']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  filepath: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModified: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['ImportStatus'], ParentType, ContextType>;
  error: Resolver<SchemaTypes.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  getAudiobooks: Resolver<
    Array<ResolversTypes['Audiobook']>,
    ParentType,
    ContextType,
    RequireFields<SchemaTypes.QueryGetAudiobooksArgs, never>
  >;
  findAudiobooks: Resolver<
    Array<ResolversTypes['Audiobook']>,
    ParentType,
    ContextType,
    RequireFields<SchemaTypes.QueryFindAudiobooksArgs, 'str'>
  >;
  getImports: Resolver<Array<ResolversTypes['Import']>, ParentType, ContextType>;
  getUsers: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getUser: Resolver<
    SchemaTypes.Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<SchemaTypes.QueryGetUserArgs, 'id'>
  >;
  logIn: Resolver<
    ResolversTypes['ID'],
    ParentType,
    ContextType,
    RequireFields<SchemaTypes.QueryLogInArgs, 'username'>
  >;
}>;

export type UserResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  CoverImage: GraphQLScalarType;
  Audiobook: AudiobookResolvers<ContextType>;
  AudiobookAuthor: AudiobookAuthorResolvers<ContextType>;
  Author: AuthorResolvers<ContextType>;
  Genre: GenreResolvers<ContextType>;
  ImportStatus: ImportStatusResolvers;
  Import: ImportResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  Date: GraphQLScalarType;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ApolloContext> = Resolvers<ContextType>;

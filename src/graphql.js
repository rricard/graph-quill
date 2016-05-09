/* @flow */

import type {
  GraphQLType,
} from "graphql"

export type GraphQLArg = {
  description?: string,
  type: GraphQLType,
}

export type GraphQLField = {
  description?: string,
  type: GraphQLType,
  args?: {[key: string]: GraphQLArg},
  resolve: (rootValue: mixed, args: {[key: string]: mixed}) => mixed,
}

export type GraphQLResolveFunction = (
  obj?: mixed,
  args?: {[key: string]: mixed},
  context?: mixed,
  info?: mixed
) => mixed

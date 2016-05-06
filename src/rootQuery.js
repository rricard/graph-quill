/* @flow */

import {
  GraphQLSchema,
} from "graphql"

import type {
  GraphQLType,
} from "graphql"

import type {
  GraphQuillType,
  GraphQuillArg,
} from "./type"

type GraphQLArg = {
  description?: string,
  type: GraphQLType,
}

type GraphQLField = {
  description?: string,
  type: GraphQLType,
  args?: {[key: string]: GraphQLArg},
  resolve: (rootValue: mixed, args: {[key: string]: mixed}) => mixed,
}

export type GraphQuillFieldWithName = {
  name: string,
  type: GraphQuillType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export type GraphQuillConnectionWithName = {
  connectedType: GraphQuillType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export function createRootQueryField(
  wrappedFunc: Function,
  opts: GraphQuillFieldWithName
): Function {
  wrappedFunc.GraphQLFields = opts
  return wrappedFunc
}

export function createRootQueryConnection(
  wrappedFunc: Function,
  opts: GraphQuillConnectionWithName
): Function {
  wrappedFunc.GraphQLFields = opts
  return wrappedFunc
}

/* @flow */

import {
  GraphQLSchema,
} from "graphql"

import type {
  GraphQuillType,
  GraphQuillArg,
} from "./type"

export type GraphQuillRootQueryField = {
  GraphQuillFieldWithName: GraphQuillFieldWithName
}

export type GraphQuillRootQueryConnection = {
  GraphQuillConnectionWithName: GraphQuillConnectionWithName
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
): GraphQuillRootQueryField {
  wrappedFunc.GraphQuillFieldWithName = opts
  return wrappedFunc
}

export function createRootQueryConnection(
  wrappedFunc: Function,
  opts: GraphQuillConnectionWithName
): GraphQuillRootQueryField {
  wrappedFunc.GraphQuillConnectionWithName = opts
  return wrappedFunc
}

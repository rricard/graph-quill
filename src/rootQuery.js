/* @flow */

import type {
  GraphQuillClosuredAnyType,
  GraphQuillArg,
} from "./type"


export type GraphQuillFieldWithName = {
  name: string,
  type: GraphQuillClosuredAnyType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export type GraphQuillConnectionWithName = {
  name: string,
  connectedType: GraphQuillClosuredAnyType,
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

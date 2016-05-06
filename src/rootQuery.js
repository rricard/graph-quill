/* @flow */

import type {
  GraphQuillType,
  GraphQuillArg,
} from "./type"


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

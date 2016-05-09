/* @flow */

import type {
  GraphQLInterfaceType,
} from "graphql"

import {
  fieldMapping,
  connMapping,
} from "./field"

import type {
  GraphQuillField,
  GraphQuillConnection,
} from "./field"


import type {
  GraphQLField,
} from "./graphql"


/* global IGraphQuillRootQuery */
export interface IGraphQuillRootQuery {
  GraphQuill: (nodeInterface: GraphQLInterfaceType) => IGraphQuillRootQuery,
  GraphQLFields?: {[key: string]: GraphQLField},
}

export function createRootQueryField(
  wrappedFunc: Function,
  name: string,
  opts: GraphQuillField
): Function {
  wrappedFunc.GraphQuill = nodeInterface => {
    let gQuillFields = {}
    gQuillFields[name] = opts
    wrappedFunc.GraphQLFields = fieldMapping(gQuillFields, nodeInterface)
    return wrappedFunc
  }
  return wrappedFunc
}

export function createRootQueryConnection(
  wrappedFunc: Function,
  name: string,
  opts: GraphQuillConnection
): Function {
  wrappedFunc.GraphQuill = nodeInterface => {
    let gQuillFields = {}
    gQuillFields[name] = opts
    wrappedFunc.GraphQLFields = connMapping(gQuillFields, nodeInterface)
    return wrappedFunc
  }
  return wrappedFunc
}

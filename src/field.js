/* @flow */

import {
  connectionFromPromisedArray,
} from "graphql-relay"

import type {
  GraphQLInterfaceType,
} from "graphql"

import type {
  GraphQLArg,
  GraphQLField,
} from "./graphql"

import type {
  GraphQuillClosuredAnyType,
} from "./type"

export type GraphQuillArg = {
  type: GraphQuillClosuredAnyType,
  description?: string
}

export type GraphQuillField = {
  type: GraphQuillClosuredAnyType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export type GraphQuillConnection = {
  connectedType: GraphQuillClosuredAnyType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

function argMapping(
  args: {[key: string]: GraphQuillArg},
  nodeInterface: GraphQLInterfaceType
): {[key: string]: GraphQLArg} {
  return Object.keys(args).map(k => {
    const arg = args[k]
    const baseType = typeof arg.type === "function" && !arg.type.prototype ?
      arg.type() :
      arg.type
    const type = baseType.GraphQuill ?
      baseType.GraphQLType || baseType.GraphQuill(nodeInterface).GraphQLType :
      baseType
    let kv = {}
    kv[k] = {
      type,
      description: arg.description,
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

export function fieldMapping(
  fields: {[key: string]: GraphQuillField},
  nodeInterface: GraphQLInterfaceType
): {[key: string]: GraphQLField} {
  return Object.keys(fields).map(k => {
    const field = fields[k]
    const baseType =
      typeof field.type === "function" && !field.type.GraphQuill ?
      field.type() :
      field.type
    const type = baseType.GraphQuill ?
      baseType.GraphQLType || baseType.GraphQuill(nodeInterface).GraphQLType :
      baseType
    let kv = {}
    kv[k] = {
      type: type,
      description: field.description,
      args: field.args ? argMapping(field.args) : undefined,
      resolve: (obj, args, context, info) =>
        obj[k](args, context, info),
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

export function connMapping(
  fields: {[key: string]: GraphQuillConnection},
  nodeInterface: GraphQLInterfaceType
): {[key: string]: GraphQLField} {
  return Object.keys(fields).map(k => {
    const field = fields[k]
    const baseConnectedType =
      typeof field.connectedType === "function" &&
      !field.connectedType.GraphQuill ?
      field.connectedType() :
      field.connectedType
    const connectedType = baseConnectedType.GraphQLType ||
      baseConnectedType.GraphQuill(nodeInterface).GraphQLConnectionType
    let kv = {}
    kv[k] = {
      type: connectedType,
      description: field.description,
      args: field.args ? argMapping(field.args) : undefined,
      resolve: (obj, args, context, info) =>
        connectionFromPromisedArray(Promise.resolve(
          obj[k](args, context, info)
        ), args),
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

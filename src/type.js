/* @flow */

import {
  GraphQLObjectType,
} from "graphql"

import {
  globalIdField,
  connectionDefinitions,
} from "graphql-relay"

import type {
  GraphQLType,
  GraphQLInterfaceType,
} from "graphql"

type GraphQuillTypeBase = {
  GraphQLType: (nodeInterface: GraphQLInterfaceType) => GraphQLType,
  GraphQLConnectionType: (type: GraphQLType) => GraphQLType,
  resolveById?: (id: mixed) => mixed
}

export type GraphQuillType = GraphQLType |
  GraphQuillTypeBase |
  () => GraphQuillTypeBase

export type GraphQuillArg = {
  type: GraphQuillType,
  description?: string
}

export type GraphQuillField = {
  type: GraphQuillType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export type GraphQuillConnection = {
  connectedType: GraphQuillType,
  description?: string,
  args?: {[key: string]: GraphQuillArg}
}

export type GraphQuillTypeInformation = {
  name: string,
  description?: string,
  idField?: string,
  cursorField?: string,
  resolveById?: (id: mixed) => mixed,
  interfaces?: Array<GraphQLInterfaceType>,
}

function argMapping(args: {[key: string]: GraphQuillArg}) {
  return Object.keys(args).map(k => {
    const arg = args[k]
    const baseType = typeof arg.type === "function" && !arg.type.prototype ?
      arg.type() :
      arg.type
    const type = baseType.GraphQuill ?
      baseType.GraphQLType || baseType.GraphQuill().GraphQLType :
      baseType
    let kv = {}
    kv[k] = {
      type,
      description: arg.description,
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

function fieldMapping(fields: {[key: string]: GraphQuillField}) {
  return Object.keys(fields).map(k => {
    const field = fields[k]
    const baseType =
      typeof field.type === "function" && !field.type.prototype ?
      field.type() :
      field.type
    const type = baseType.GraphQuill ?
      baseType.GraphQLType || baseType.GraphQuill().GraphQLType :
      baseType
    let kv = {}
    kv[k] = {
      type,
      description: field.description,
      args: field.args ? argMapping(field.args) : undefined,
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

function connMapping(fields: {[key: string]: GraphQuillConnection}) {
  return Object.keys(fields).map(k => {
    const field = fields[k]
    const baseConnectedType =
      typeof field.connectedType === "function" &&
      !field.connectedType.prototype ?
      field.connectedType() :
      field.connectedType
    const connectedType = baseConnectedType.GraphQLType ||
      baseConnectedType.GraphQuill().GraphQLConnectionType
    let kv = {}
    kv[k] = {
      type: connectedType,
      description: field.description,
      args: field.args ? argMapping(field.args) : undefined,
    }
    return kv
  }).reduce((obj, kv) => Object.assign(obj, kv), {})
}

export function createType(
  wrappedClass: Object,
  {
    name,
    description,
    resolveById,
    idField,
    interfaces,
  }: GraphQuillTypeInformation,
  fields: {[key: string]: GraphQuillField},
  connections?: {[key: string]: GraphQuillConnection}
): Object {
  return Object.assign(wrappedClass, {
    GraphQuill: nodeInterface => {
      const type = new GraphQLObjectType({
        name,
        description,
        fields: () => Object.assign({
          id: idField && resolveById ? globalIdField(name) : undefined,
        }, fieldMapping(fields), connMapping(connections || {})),
        interfaces: [].concat(interfaces || [], idField && resolveById ?
          [nodeInterface] :
          []),
      })
      return Object.assign(wrappedClass, {
        GraphQLType: type,
        GraphQLConnectionType: idField && resolveById ?
          connectionDefinitions({nodeType: type}).connectedType :
          undefined,
        resolveById,
      })
    },
  })
}

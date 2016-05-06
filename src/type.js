/* @flow */

import {
  GraphQLObjectType,
} from "graphql"

import type {
  GraphQLType,
  GraphQLInterfaceType,
} from "graphql"

type GraphQuillTypeBase = {
  GraphQLType: (nodeInterface: GraphQLInterfaceType) => GraphQLType,
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
  resolveById?: (id: mixed) => mixed
}

export function createType(
  wrappedClass: Class<Object>,
  typeInfo: GraphQuillTypeInformation,
  fields: {[key: string]: GraphQuillField},
  connections?: {[key: string]: GraphQuillConnection}
): Class<Object> {
  return Object.assign({}, wrappedClass, {
    GraphQLType: () => new GraphQLObjectType(),
    resolveById: typeInfo.resolveById,
  })
}

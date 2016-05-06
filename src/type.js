/* @flow */

import {
  GraphQLObjectType,
} from "graphql"

import type {
  GraphQLType,
} from "graphql"

export type GraphQuillType = GraphQLType |
  {GraphQuillType: GraphQLType} |
  () => GraphQLType |
  () => {GraphQuillType: GraphQLType}

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
}

export function createType(
  wrappedClass: Class<Object>,
  typeInfo: GraphQuillTypeInformation,
  fields: {[key: string]: GraphQuillField},
  connections?: {[key: string]: GraphQuillConnection}
): Class<Object> {
  return Object.assign({}, wrappedClass, {
    GraphQuillType: new GraphQLObjectType(),
  })
}

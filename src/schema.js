/* @flow */

import {
  GraphQLSchema,
  GraphQLObjectType,
} from "graphql"

import {
  nodeDefinitions,
  fromGlobalId,
} from "graphql-relay"

import type {
  IGraphQuillType,
} from "./type"

export function createSchema(
  types: Array<IGraphQuillType>
): GraphQLSchema {
  const {nodeInterface, nodeField} = nodeDefinitions(
    globalId => {
      const {type, id} = fromGlobalId(globalId)
      const matches = expandedTypes.filter(t =>
        t.GraphQLType && t.GraphQLConnectionType && t.resolveById &&
        t.GraphQLType.name === type
      )
      return matches.length > 0 && matches[0].resolveById ?
        matches[0].resolveById(id) :
        Promise.reject(new Error(`No matching Relay type for ${type}`))
    },
    obj => {
      const matches = expandedTypes.filter(t => obj instanceof t)
      return matches.length > 0 ?
        matches[0] :
        Promise.reject(new Error(`No matching Relay type for object`))
    }
  )
  const expandedTypes = types.map(possibleType => {
    if(possibleType.GraphQuill && !possibleType.GraphQLType) {
      return possibleType.GraphQuill(nodeInterface)
    } else if(possibleType.GraphQLType) {
      return possibleType
    } else {
      throw new Error("Non-GraphQuill-annotated class")
    }
  })
  const queryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query: Graph Entry Point",
    fields: () => ({
      node: nodeField,
    }),
  })
  return new GraphQLSchema({
    query: queryType,
  })
}

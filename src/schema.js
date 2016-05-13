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

import type {
  IGraphQuillRootQuery,
} from "./rootQuery"

import type {
  IGraphQuillMutation,
} from "./mutation"

export function createSchema(
  types: Array<IGraphQuillType>,
  rootQueriesAndConns: Array<IGraphQuillRootQuery>,
  mutations?: Array<IGraphQuillMutation>
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
        matches[0].GraphQLType :
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
  const expandedRootQueries = rootQueriesAndConns.map(possibleRootQuery => {
    if(possibleRootQuery.GraphQuill && !possibleRootQuery.GraphQLFields) {
      return possibleRootQuery.GraphQuill(nodeInterface)
    } else {
      throw new Error("Non-GraphQuill-annotated root query")
    }
  })
  const queryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query: Graph Entry Point",
    fields: () => Object.assign({
      node: nodeField,
    }, ...expandedRootQueries.map(exp => exp.GraphQLFields)),
  })
  let mutationType = undefined
  if(mutations) {
    const expandedMutations = mutations.map(possibleMutation => {
      if(possibleMutation.GraphQuill && !possibleMutation.GraphQLMutation) {
        return possibleMutation.GraphQuill(nodeInterface)
      } else if(possibleMutation.GraphQLMutations) {
        return possibleMutation
      } else {
        throw new Error("Non-GraphQuill-annotated mutation")
      }
    })
    mutationType = new GraphQLObjectType({
      name: "Mutation",
      description: "Root Mutation: Mutation Graph Entry Point",
      fields: () => Object.assign({
        node: nodeField,
      }, ...expandedMutations.map(exp => exp.GraphQLMutations)),
    })
  }
  return new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
  })
}

/* @flow */

import {
  GraphQLSchema,
} from "graphql"

import type {
  GraphQuillType,
} from "./type"

export function createSchema(types: Array<GraphQuillType>): GraphQLSchema {
  return new GraphQLSchema()
}

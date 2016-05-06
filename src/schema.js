/* @flow */

import {
  GraphQLSchema,
} from "graphql"

import type {
  GraphQuillEnhancedClass,
} from "./type"

export function createSchema(
  types: Array<GraphQuillEnhancedClass>
): GraphQLSchema {
  return new GraphQLSchema()
}

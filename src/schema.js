/* @flow */

import {
  GraphQLSchema,
} from "graphql"

import type {
  IGraphQuillType,
} from "./type"

export function createSchema(
  types: Array<IGraphQuillType>
): GraphQLSchema {
  return new GraphQLSchema()
}

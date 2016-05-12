/* @flow */

import {
  mutationWithClientMutationId,
} from "graphql-relay"

import {
  argMapping,
  fieldMapping,
  connMapping,
} from "./field"

import type {
  GraphQLInterfaceType,
} from "graphql"

import type {
  GraphQLField,
} from "./graphql"

import type {
  GraphQuillArg,
  GraphQuillField,
  GraphQuillConnection,
} from "./field"

/* global IGraphQuillMutation */
export interface IGraphQuillMutation {
  GraphQuill: (nodeInterface: GraphQLInterfaceType) => IGraphQuillMutation,
  GraphQLMutations?: {[key: string]: GraphQLField},
}

type GraphQuillMutationInformation = {
  name: string,
  description?: string,
}

export function createMutation(
  wrappedFunc: Function,
  {
    name,
    description,
  }: GraphQuillMutationInformation,
  args: {[key: string]: GraphQuillArg},
  fields: {[key: string]: GraphQuillField},
  connections?: {[key: string]: GraphQuillConnection}
): IGraphQuillMutation {
  wrappedFunc.GraphQuill = nodeInterface => {
    wrappedFunc.GraphQLMutations = {}
    wrappedFunc.GraphQLMutations[name] = mutationWithClientMutationId({
      name: name.slice(0,1).toUpperCase() + name.slice(1),
      description: description,
      inputFields: argMapping(args, nodeInterface),
      outputField: [].concat(
        fieldMapping(fields, nodeInterface),
        (connections && connMapping(connections, nodeInterface)) || []
      ),
      mutateAndGetPayload: wrappedFunc,
    })
    return wrappedFunc
  }
  return wrappedFunc
}

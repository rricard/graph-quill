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

import {
  fieldMapping,
  connMapping,
} from "./field"

import type {
  GraphQuillField,
  GraphQuillConnection,
} from "./field"

/* global IGraphQuillType */
export interface IGraphQuillType {
  GraphQuill: (nodeInterface: GraphQLInterfaceType) => IGraphQuillType,
  GraphQLType?: GraphQLType,
  GraphQLConnectionType?: GraphQLType,
  resolveById?: (id: mixed) => mixed,
}

export type GraphQuillAnyType = GraphQLType | IGraphQuillType

export type GraphQuillClosuredAnyType = GraphQuillAnyType | () => GraphQuillAnyType

type GraphQuillTypeInformation = {
  name: string,
  description?: string,
  idField?: string,
  cursorField?: string,
  resolveById?: (id: mixed) => mixed,
  interfaces?: Array<GraphQLInterfaceType>,
}

export function createType<Klass: Object>(
  wrappedClass: Klass,
  {
    name,
    description,
    resolveById,
    idField,
    interfaces,
  }: GraphQuillTypeInformation,
  fields: {[key: string]: GraphQuillField},
  connections?: {[key: string]: GraphQuillConnection}
): IGraphQuillType & Klass {
  return Object.assign(wrappedClass, {
    GraphQuill: nodeInterface => {
      const type = new GraphQLObjectType({
        name,
        description,
        fields: () => Object.assign({},
          idField && resolveById ?
            {id: globalIdField(name, obj => obj[idField]) } : {},
          fieldMapping(fields, nodeInterface),
          connMapping(connections || {}, nodeInterface)
        ),
        interfaces: [].concat(interfaces || [], idField && resolveById ?
          [nodeInterface] :
          []
        ),
      })
      return Object.assign(wrappedClass, {
        GraphQLType: type,
        GraphQLConnectionType: idField && resolveById ?
          connectionDefinitions({ nodeType: type }).connectionType :
          undefined,
        resolveById,
      })
    },
  })
}

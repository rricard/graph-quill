/* @flow */

import {
  createType,
} from "./type"

import {
  createSchema,
} from "./schema"

import {
  createRootQueryField,
  createRootQueryConnection,
} from "./rootQuery"

// Use module.exports for a React/Relay-like export interface
module.exports = {
  createType,
  createSchema,
  createRootQueryField,
  createRootQueryConnection,
}

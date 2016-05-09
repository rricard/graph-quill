/* @flow */

import { toGlobalId } from "graphql-relay"

import { createQueryAsserter } from "graph-spec"

import BlogSchema from "./schemas/blog"

const assertBlog = createQueryAsserter(BlogSchema, {})

const fragmentsImport = `
  fragment AuthorSummary on Author {
    id
    name
  }

  fragment PostSummary on Post {
    id
    title
    content
    author {
      ...AuthorSummary
    }
  }
`

const postGlobalIds = [0, 1, 2].map(id => toGlobalId("Post", id))

describe("Blog Test Schema", () => {
  it("should enable direct post retreival via the node root query", () =>
    assertBlog(`
      ${fragmentsImport}

      query RootNodeArticleQuery($id: ID!) {
        node(id: $id) {
          ...PostSummary
        }
      }
    `, {}, {
      variableValues: {
        id: postGlobalIds[0],
      },
    })
  )
})

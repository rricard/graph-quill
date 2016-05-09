/* @flow */

import { toGlobalId } from "graphql-relay"

import { createQueryAsserter } from "graph-spec"

import BlogSchema from "./schemas/blog"

const assertBlog = createQueryAsserter(BlogSchema, {})

const postGlobalIds = [0, 1, 2].map(id => toGlobalId("Post", id))

describe("Blog Test Schema", () => {
  const authorSummaryFragment = `
    fragment AuthorSummary on Author {
      id
      name
    }
  `
  const postSummaryFragment = `
    ${authorSummaryFragment}

    fragment PostSummary on Post {
      id
      title
      content
      author {
        ...AuthorSummary
      }
    }
  `

  describe("node(id: ID!)", () => {
    const postRetrQuery = `
      ${postSummaryFragment}

      query PostRetrievalQuery($id: ID!) {
        node(id: $id) {
          ...PostSummary
        }
      }
    `

    it("should get the first post", () => assertBlog(postRetrQuery, {
      node: {
        id: postGlobalIds[0],
        title: "A post",
        content: "Hello world!",
        author: {
          id: "QXV0aG9yOjA=",
          name: "Anonymous",
        },
      },
    }, {
      variableValues: {
        id: postGlobalIds[0],
      },
    }))
  })
})

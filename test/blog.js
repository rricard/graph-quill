/* @flow */

import { toGlobalId } from "graphql-relay"

import { createQueryAsserter } from "graph-spec"

import BlogSchema from "./schemas/blog"

const assertBlog = createQueryAsserter(BlogSchema, {})

const postGlobalIds = [0, 1, 2].map(id => toGlobalId("Post", id))
const authorGlobalIds = [0, 1].map(id => toGlobalId("Author", id))

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

    const authorRetrQuery = `
      ${authorSummaryFragment}

      query AuthorRetrievalQuery($id: ID!) {
        node(id: $id) {
          ...AuthorSummary
        }
      }
    `

    it("should get the first post", () => assertBlog(postRetrQuery, {
      node: {
        id: postGlobalIds[0],
        title: "A post",
        content: "Hello world!",
        author: {
          id: authorGlobalIds[0],
          name: "Anonymous",
        },
      },
    }, {
      variableValues: {
        id: postGlobalIds[0],
      },
    }))

    it("should get the second post", () => assertBlog(postRetrQuery, {
      node: {
        id: postGlobalIds[1],
        title: "My Post",
        content: "Robin's post!",
        author: {
          id: authorGlobalIds[1],
          name: "Robin",
        },
      },
    }, {
      variableValues: {
        id: postGlobalIds[1],
      },
    }))

    it("should get the first author", () => assertBlog(authorRetrQuery, {
      node: {
        id: authorGlobalIds[0],
        name: "Anonymous",
      },
    }, {
      variableValues: {
        id: authorGlobalIds[0],
      },
    }))

    it("should get the second author", () => assertBlog(authorRetrQuery, {
      node: {
        id: authorGlobalIds[1],
        name: "Robin",
      },
    }, {
      variableValues: {
        id: authorGlobalIds[1],
      },
    }))
  })
})

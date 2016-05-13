/* @flow */

import { toGlobalId } from "graphql-relay"

import { createQueryAsserter } from "graph-spec"

import BlogSchema from "./schemas/blog"

const assertBlog = createQueryAsserter(BlogSchema, {
  rootValue: {userId: 1},
})

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

  const authorAndItsPostsFragement = `
    fragment AuthorAndPosts on Author {
      id
      name
      posts {
        edges {
          node {
            title
          }
        }
      }
    }
  `

  describe("query me", () => {
    const getMeAndMyPosts = `
      ${authorAndItsPostsFragement}

      query MeQuery {
        me {
          ...AuthorAndPosts
        }
      }
    `

    it("should get me and my posts", () => assertBlog(getMeAndMyPosts, {
      me: {
        id: authorGlobalIds[1],
        name: "Robin",
        posts: {
          edges: [
            { node: { title: "My Post" } },
            { node: { title: "My Second Post" } },
          ],
        },
      },
    }))
  })

  describe("query allPosts", () => {
    const allPaginatedQuery = `
      ${postSummaryFragment}

      query AllQuery {
        allPosts(first: 2) {
          edges {
            node {
              ...PostSummary
            }
          }
        }
      }
    `

    it("should get all posts in a conn", () => assertBlog(allPaginatedQuery, {
      allPosts: {
        edges: [
          {
            node: {
              id: postGlobalIds[0],
              title: "A post",
              content: "Hello world!",
              author: {
                id: authorGlobalIds[0],
                name: "Anonymous",
              },
            },
          },
          {
            node: {
              id: postGlobalIds[1],
              title: "My Post",
              content: "Robin's post!",
              author: {
                id: authorGlobalIds[1],
                name: "Robin",
              },
            },
          },
        ],
      },
    }))
  })

  describe("query node(id: ID!)", () => {
    const postRetrQuery = `
      ${postSummaryFragment}

      query PostRetrievalQuery($id: ID!) {
        node(id: $id) {
          ...PostSummary
        }
      }
    `

    const authorRetrQuery = `
      ${authorAndItsPostsFragement}

      query AuthorRetrievalQuery($id: ID!) {
        node(id: $id) {
          ...AuthorAndPosts
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
        posts: {
          edges: [
            { node: { title: "A post" } },
          ],
        },
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
        posts: {
          edges: [
            { node: { title: "My Post" } },
            { node: { title: "My Second Post" } },
          ],
        },
      },
    }, {
      variableValues: {
        id: authorGlobalIds[1],
      },
    }))
  })

  describe("mutation newPost", () => {
    it("should create the new post", () => assertBlog(`
      ${postSummaryFragment}

      mutation CreateNewPost(
        $mutationId: String!,
        $title: String!,
        $content: String!
      ) {
        newPost(input: {
          clientMutationId: $mutationId,
          title: $title,
          content: $content
        }) {
          clientMutationId
          newPost {
            ...PostSummary
          }
          allPosts(last: 2) {
            edges {
              node {
                ...PostSummary
              }
            }
          }
        }
      }
    `, {
      "newPost": {
        "clientMutationId": "1",
        "newPost": {
          "id": "UG9zdDoz",
          "title": "A mutation-issued post",
          "content": "Look at this! Awesome!",
          "author": {
            "id": "QXV0aG9yOjE=",
            "name": "Robin",
          },
        },
        "allPosts": {
          "edges": [
            {
              "node": {
                "id": "UG9zdDoy",
                "title": "My Second Post",
                "content": "Wow!",
                "author": {
                  "id": "QXV0aG9yOjE=",
                  "name": "Robin",
                },
              },
            },
            {
              "node": {
                "id": "UG9zdDoz",
                "title": "A mutation-issued post",
                "content": "Look at this! Awesome!",
                "author": {
                  "id": "QXV0aG9yOjE=",
                  "name": "Robin",
                },
              },
            },
          ],
        },
      },
    }, {
      variableValues: {
        mutationId: "1",
        title: "A mutation-issued post",
        content: "Look at this! Awesome!",
      },
    }))
  })
})

/* @flow */

import {
  GraphQLString,
} from "graphql"

import GraphQuill from "../../src"

class Post {
  id: number;
  authorId: number;
  title: string;
  content: string;
  creationDate: Date;

  constructor(
    id=0, authorId=0, title="A post", content="Hello world!",
    creationDate=new Date()
  ) {
    this.id = id
    this.authorId = authorId
    this.title = title
    this.content = content
    this.creationDate = creationDate
  }

  author() {
    return authors.filter(a => a.id == this.authorId)[0]
  }
}

Post = GraphQuill.createType(Post, {
  name: "Post",
  description: "An authored blog post",
  idField: "id",
  cursorField: "creationDate",
  resolveById: id => {
    return posts.filter(p => p.id == id)[0]
  },
}, {
  title: {
    type: GraphQLString,
    description: "Post's title",
  },
  content: {
    type: GraphQLString,
    description: "Post's markdown contents",
  },
  creationDate: {
    type: GraphQLString,
    description: "Post's creation date",
  },
  author: {
    type: () => Author,
    description: "Post's author",
  },
})

const posts = [
  new Post(),
  new Post(1, 1, "My Post", "Robin's post!"),
  new Post(2, 1, "My Second Post", "Wow!"),
]

class Author {
  id: number;
  name: string;

  constructor(id=0, name="Anonymous") {
    this.id = id
    this.name = name
  }

  posts() {
    return posts.filter(p => p.authorId == this.id)
  }
}

Author = GraphQuill.createType(Author, {
  name: "Author",
  description: "A creator of content",
  idField: "id",
  resolveById: id => authors.filter(a => a.id == id)[0],
}, {
  name: {
    type: GraphQLString,
    description: "Author's name",
  },
}, {
  posts: {
    connectedType: () => Post,
    description: "Author's own posts",
  },
})

const authors = [
  new Author(),
  new Author(1, "Robin"),
]

function me({userId}) {
  return authors.filter(a => a.id == userId)[0]
}

me = GraphQuill.createRootQueryField(me, "me", {
  description: "Get the currently connected user",
  type: () => Author,
})

function allPosts() {
  return posts
}

allPosts = GraphQuill.createRootQueryConnection(allPosts, "allPosts", {
  description: "Get all of the connected posts",
  connectedType: () => Post,
})

export default GraphQuill.createSchema([
  Post,
  Author,
], [
  me,
  allPosts,
])

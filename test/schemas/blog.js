/* @flow */

import {
  GraphQLString
} from "graphql"

import GraphQuill from "../../src";

class BlogItem {
  constructor(fields?: {[key: string]: mixed}) {
    if(fields) {
      Object.assign(this, fields)
    }
  }
}

class Post extends BlogItem {
  id: number = 0;
  authorId: number = 0;
  title: string = "A post";
  content: string = "Hello world!";
  creationDate: Date = new Date();

  author() {
    return authors.filter(a => a.id == this.authorId)[0]
  }
}

Post = GraphQuill.createType(Post, {
  name: "Post",
  description: "An authored blog post",
  idField: "id",
  cursorField: "creationDate",
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
  }
})

const posts = [
  new Post(),
  new Post({id: 1, authorId: 1, title: "My Post", content: "Robin's post!"}),
  new Post({id: 1, authorId: 1, title: "My Second Post", content: "Wow!"}),
]

class Author extends BlogItem {
  id: number = 0;
  name: string = "Anonymous";

  posts() {
    return posts.filter(p => p.authorId == this.id)
  }
}

Author = GraphQuill.createType(Author, {
  name: "Author",
  description: "A creator of content",
  idField: "id"
}, {
  name: {
    type: GraphQLString,
    description: "Author's name"
  },
}, {
  posts: {
    connectedType: () => Post,
    description: "Author's own posts"
  }
})

const authors = [
  new Author(),
  new Author({id: 1, name: "Robin"})
]

function me({userId}) {
  return authors[userId]
}

me = GraphQuill.createRootQueryField(me, {
  name: "me",
  description: "Get the currently connected user",
  type: () => Author
})

function allPosts() {
  return posts;
}

allPosts = GraphQuill.createRootQueryConnection(allPosts, {
  name: "allPosts",
  description: "Get all of the connected posts",
  connectedType: () => Post
})

export default GraphQuill.createSchema([
  Post,
  Author,
  me,
  allPosts,
])

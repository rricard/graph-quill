# GraphQuill

GraphQL Schema creation Sugar

[![Build Status](https://travis-ci.org/rricard/graph-quill.svg?branch=master)](https://travis-ci.org/rricard/graph-quill) [![Code Climate](https://codeclimate.com/github/rricard/graph-quill/badges/gpa.svg)](https://codeclimate.com/github/rricard/graph-quill) [![Issue Count](https://codeclimate.com/github/rricard/graph-quill/badges/issue_count.svg)](https://codeclimate.com/github/rricard/graph-quill)

---

GraphQuill is a tool based on the [GraphQL reference implementation][graphql-js]
and the [Relay GraphQL supporting Library][graphql-relay-js] which goal is to
help write [GraphQL][graphql] servers compliant with the
[GraphQL Relay Specification][graphql-relay-spec].

[graphql]: http://graphql.org
[graphql-js]: https://github.com/graphql/graphql-js
[graphql-relay-js]: https://github.com/graphql/graphql-relay-js
[graphql-relay-spec]: https://facebook.github.io/relay/docs/graphql-relay-specification.html

## Example

As seen in the [tested example][blog-schema], you can "wrap" any class like
you would
[add a container around a React component in Relay][relay-container]:

```javascript
import GraphQuill from "graph-quill"

// Wrap Types
class Post {
  // ...
}

Post = GraphQuill.createType(Post, {
  name: "Post",
  description: "An authored blog post",
  idField: "id",
  cursorField: "creationDate",
  resolveById: id => {
    // ...
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
  }
})

// Wrap Root Queries
function allPosts() {
  // ...
}

allPosts = GraphQuill.createRootQueryConnection(allPosts, "allPosts", {
  description: "Get all of the connected posts",
  connectedType: () => Post,
})

// Wrap Mutations
function newPost({title, content}, _, {rootValue: {userId}}) {
  // ...
  return {
    newPost: newPost,
    allPosts: allPosts(),
  }
}

newPost = GraphQuill.createMutation(newPost, {
  name: "newPost",
  description: "Creates a new post from the current user",
}, {
  title: {
    type: new GraphQLNonNull(GraphQLString),
    description: "The new post's title",
  },
  content: {
    type: new GraphQLNonNull(GraphQLString),
    description: "The new post's content",
  },
}, {
  newPost: {
    type: () => Post,
    description: "The freshly created post",
  },
}, {
  allPosts: {
    connectedType: () => Post,
    description: "All of the posts including the new one",
  },
})

// Register in one schema
export default GraphQuill.createSchema([
  Post,
], [
  allPosts,
], [
  newPost
])
```

In the end, you just end up combining your wrapped types and root queries into
a usable GraphQL Schema.

[blog-schema]: ./test/schemas/blog.js
[relay-container]: https://facebook.github.io/relay/docs/guides-containers.html

## Installation

The core GraphQuill package can be easily installed with the following command:

```
npm install --save graph-quill
```

## Roadmap

- **More control over the relay layer** - API design work needed
- **Babel plugin for parsing comments & flow annotations** for automatic graphql
schema inference

## Contributing

GraphQuill is still at early stages but you are encouraged to help!

Feature requests are not a priority though as I am maintaining this alone for
now. If you want to add a feature, please send me a Pull-Request containing
the feature and associated tests. If you want to be sure to see your feature
accepted, create an issue to discuss it.

Bug reports are welcome if you provide clear context information and steps to
reproduce.

Bug fixes are always welcome!

The CI servers will ensure correct typechecking as well as passing tests and
linted code. Make sure it works on your side too using:

- `npm run typecheck`
- `npm test`
- `npm run lint`

## Author

Robin Ricard

## Licence

```
The MIT License (MIT)

Copyright (c) 2016 Robin Ricard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

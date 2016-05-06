# GraphQuill

GraphQL Schema creation Sugar

[![Build Status](https://travis-ci.com/rricard/graph-quill.svg?token=2g9rnBV6ArnPHqPzyhwo&branch=master)](https://travis-ci.com/rricard/graph-quill) [![Code Climate](https://codeclimate.com/repos/572c83a95d6d1f7229001686/badges/b2777c3f81c698242d28/gpa.svg)](https://codeclimate.com/repos/572c83a95d6d1f7229001686/feed) [![Test Coverage](https://codeclimate.com/repos/572c83a95d6d1f7229001686/badges/b2777c3f81c698242d28/coverage.svg)](https://codeclimate.com/repos/572c83a95d6d1f7229001686/coverage) [![Issue Count](https://codeclimate.com/repos/572c83a95d6d1f7229001686/badges/b2777c3f81c698242d28/issue_count.svg)](https://codeclimate.com/repos/572c83a95d6d1f7229001686/feed)

---

GraphQuill is a tool based on the [GraphQL reference implementation][graphql-js]
which goal is to help write [GraphQL][graphql] servers compliant with the
[GraphQL Relay Specification][graphql-relay-spec].

[graphql]: http://graphql.org
[graphql-js]: https://github.com/graphql/graphql-js
[graphql-relay-spec]: https://facebook.github.io/relay/docs/graphql-relay-specification.html

## Features

### Class and function-level type registration

Annotate your class in order to generate GraphQL types. The resolve mechanism,
your implementation, is central with GraphQuill and you won't spend time gluing
your schema to the actual logic.

```js
import {
  QuillType,
  QuillRootQuery,
  QuillMutation,
  QuillField,
  QuillIdField,
  QuillConnectionField,
} from "graph-quill";

import {
  GraphQLString
} from "graphql";

import Article from "./Article";

@QuillType({
  name: "Article",
  description: "An user able to write articles"
})
export default class Author extends SomeORM.Model {
  @GraphQLIdField
  id() {
    return this.id;
  }

  @GraphQLField({
    name: "name",
    description: "Author's signing name",
    type: GraphQLString
  })
  name() {
    return this.firstName + ' ' + this.lastName;
  }

  @QuillConnectionField({
    name: "articles",
    description: "Author's articles",
    connectedType: Article.QuillType
  })
  articles() {
    return Article.find({author: this.id});
  }
}

@QuillRootQuery({
  name: "me",
  description: "Gets the current user's author profile",
  type: Author.QuillType
})
export function me({session}) {
  return Author.find({id: session.userId});
}

@QuillRootQuery({
  name: "search",
  description: "Search for an author by its name",
  args: {
    name: {
      "description": "Author's full name",
      "type": GraphQLString
    }
  },
  type: Author.QuillType
})
export function search(_, {name}) {
  const [firstName, lastName] = name.split(' ');
  return Author.findAll({firstName, lastName});
}

@QuillMutation({
  name: "createAuthor",
  description: "Creates a new author",
  fields: {
    name: {
      "description": "Author's full name",
      "type": GraphQLString
    }
  },
  type: Author.QuillType
})
export function createAuthor(_, {name}) {
  const [firstName, lastName] = name.split(' ');
  return new Author({firstName, lastName}).save();
}
```

### Automatic annotation

Most of the information GraphQuill can get is already there if you use
[Flow][flowtype] and correctly comment your files. Using [Babel][babeljs],
we can setup for you the annotations by correctly setting description and types.

```js
@QuillType
// An user able to write articles
export default class Author extends SomeORM.Model {
  @GraphQLIdField
  id(): string {
    return this.id;
  }

  @GraphQLField
  // Author's signing name
  name(): string {
    return this.firstName + ' ' + this.lastName;
  }

  @QuillConnectionField
  // Author's articles
  articles(): Promise<Article> {
    return Article.find({author: this.id});
  }
}

@QuillRootQuery
// Gets the current user's author profile
export function me({session}: any): Promise<Author> {
  return Author.find({id: session.userId});
}

@QuillRootQuery
// Search for an author by its name
//
// - name: Author's full name
export function search({}: any, {name}: {name: string}): Promise<Author> {
  const [firstName, lastName] = name.split(' ');
  return Author.find({firstName, lastName});
}

@QuillMutation
// Creates a new author
//
// - name: Author's full name
export function createAuthor({}: any, {name}: {name: string}): Promise<Author> {
  const [firstName, lastName] = name.split(' ');
  return new Author({firstName, lastName}).save();
}
```

[flowtype]: http://flowtype.org
[babeljs]: https://babeljs.io

### Simple registration

We provide an easy way to generate your GraphQL schema:

```js
import GraphQuill from "graph-quill";

import Author, {me, createAuthor} from "./models/Author";
import Article from "./models/Author";

const schema = GraphQuill.register([
  Author,
  Article,
  me,
  createAuthor
]);

export default schema;
```

## Installation

The core GraphQuill package can be easily installed with the following command:

```
npm install --save graph-quill
```

### Automatic annotation babel plugin

If you want to leverage the automatic annotation system, you can install the
plugin if you ensure that the [decorator transform][decorator-babel] and the
[flow syntax][flow-babel] plugins are already active:

```
npm install --save-dev babel-plugin-graph-quill
```

**`.babelrc`**
```json
{
  ...
  "plugins": [
    ...
    "graph-quill"
  ]
}
```

Or you can use a preset ready for GraphQuill directly:

```
npm install --save-dev babel-preset-graph-quill
```

**`.babelrc`**
```json
{
  "presets": ["graph-quill"]
}
```

[decorator-babel]: http://babeljs.io/docs/plugins/transform-decorators/
[flow-babel]: http://babeljs.io/docs/plugins/syntax-flow/

## Contributing

GraphQuill is still at early stages but you are encouraged to help!

Feature requests are not a priority though as I am maintaining this alone for
now. If you want to add a feature, please send me a Pull-Request containing
the feature and associated tests. If you want to be sure to see your feature
accepted, create an issue to discuss it.

Bug reports are welcome if you provide clear context information and steps to
reproduce.

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

import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: 1,
    name: "user one",
    email: "userone@email.com",
    age: 21,
  },
  {
    id: 2,
    name: "user two",
    email: "usertwo@email.com",
    age: 11,
  },
  {
    id: 3,
    name: "user three",
    email: "userthree@email.com",
  },
];

const posts = [
  {
    id: "1",
    title: "post one",
    body: "body one",
    isPublished: true,
    author: "2",
  },
  {
    id: "2",
    title: "post two",
    body: "body two",
    isPublished: false,
    author: "1",
  },
  {
    id: "3",
    title: "post three",
    body: "body three",
    author: "1",
  },
];

const typeDefs = `
  type Query {
    getGreeting(name: String): String!
    users: [User!]!
    getFattylee: Fattylee!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean
    author:User
  }
  type Fattylee {
    id: ID!
    name: String!
    friends: [String!]!
    optional: String
  }
`;

const resolvers = {
  Query: {
    getFattylee() {
      return {
        id: "782eh2e2",
        name: "fattylee",
        friends: [2, true],
        optional: "say a nice word",
      };
    },
    getGreeting(parent, args, ctx, info) {
      if (!args.name) return "Hi, buddy";
      return `Hi, ${args.name}`;
    },
    users(parent, args, ctx, info) {
      return users;
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      console.log(parent);
      return posts;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      console.log(parent);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({ port: 8080 }, ({ port }) => {
  console.log("Server is running on port", port);
});


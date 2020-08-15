import { GraphQLServer, PubSub } from "graphql-yoga";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";

const axios = Axios.create({ baseURL: "http://localhost:3000" });
// axiosCall();
const pubsub = new PubSub();
let num = 0;
setInterval(() => {
  pubsub.publish("increase", {
    counter: {
      name: ++num,
    },
  });
}, 1000);
const typeDefs = `
  type Subscription {
    counter:Man!
  }
  type Man{
    name: Int!
  }
  type Mutation {
    createUser(data:createUserInput!):User!
    createPost(data:createPostInput!):Post!
    createComment(data:createCommentInput!):Comment!
    deleteUser(id:ID!):Boolean!
  }
  input createCommentInput {
    text:String!
    author:Int!
    post:Int!
  }
  input createPostInput {
    title:String!
    author:Int!
  }
  input createUserInput {
    name:String!
  }
  type Query {
    add(nums:[Int!]!):Float!
    hello:String!
    me(id:ID!):User!
    list:[Int!]!
    posts(id:ID):[Post!]!
    comments(id:ID):[Comment!]!
  }
  type User {
    id:ID!
    name:String!
    posts:[Post!]!
  }
  type Post {
    id:ID!
    title:String!
    author:User!
  }
  type Comment {
    id:ID!
    text:String!
    author:User!
    post:Post!
  }
`;

const resolvers = {
  Subscription: {
    counter: {
      subscribe() {
        return pubsub.asyncIterator("increase");
      },
    },
  },
  Mutation: {
    async deleteUser(parent, args) {
      try {
        const { data } = await axios.delete("users/" + args.id);
        const { data: posts } = await axios.get(`posts`, {
          params: {
            author: args.id,
          },
        });
        // delete all posts associated with the given id
        const res = await Promise.all(
          posts.map(({ id }) => axios.delete(`posts/${id}`))
        );
        const { data: comments } = await axios.get("comments");
        comments.filter((comment) => {
          postIds.includes(comment.post);
        });
        console.log(comments);
        // return;
        // await Promise.all(
        // posts.map(({ id }) => axios.delete(`comments/${id}`))
        // );
        const postIds = data.map(({ id }) => id);

        return true;
      } catch (error) {
        console.log(error.message);
        return false;
      }
    },
    async createComment(parent, args) {
      const { text, author, post } = args.data;
      let { data } = await axios.get("users", {
        params: {
          id: author,
        },
      });
      if (!data.length) {
        throw new Error("User not found");
      }
      ({ data } = await axios.get("posts", {
        params: {
          id: post,
        },
      }));
      if (!data.length) {
        throw new Error("Post not found");
      }

      ({ data } = await axios.post("comments", { text, author, post }));
      return data;
    },
    async createPost(parent, args) {
      const { title, author } = args.data;
      let { data } = await axios.get("users", {
        params: {
          id: author,
        },
      });
      if (!data.length) {
        throw new Error("User not found");
      }

      ({ data } = await axios.post("posts", { title, author }));
      return data;
    },
    async createUser(parent, { data: { name } }) {
      const { data } = await axios.post("users", { name });
      return data;
    },
  },
  Comment: {
    author: async (parent) => {
      const { data } = await axios.get("users");
      return data.find((user) => user.id == parent.author);
    },
    post: async (parent) => {
      const { data } = await axios.get("posts");
      return data.find((post) => post.id == parent.post);
    },
  },
  User: {
    posts: async (parent) => {
      const { data } = await axios.get("posts");
      return data.filter((post) => post.author == parent.id);
    },
  },
  Post: {
    async author(parent, args, ctx, info) {
      const { data } = await axios.get("users");
      return data.find((user) => user.id == parent.author);
    },
  },
  Query: {
    async comments(parent, args, ctx, info) {
      const { data } = await axios.get("comments");
      if (args.id) {
        return data.find((comment) => comment.id == args.id);
      }
      return data;
    },
    async posts(parent, args, ctx, info) {
      const { data } = await axios.get("posts");
      if (args.id) {
        return data.find((post) => post.id == args.id);
      }
      return data;
    },
    add(parent, args, ctx, info) {
      if (args.nums.length === 0) return 0;
      return args.nums.reduce((acc, num) => acc + num);
    },
    list: () => [1, 3, 6],
    hello: () => "Hi, world",
    async me(_, { id }) {
      const { data } = await axios.get("users");
      return data.find((user) => user.id == id);
      return {
        id: "sas",
        name: "abu",
        posts: [],
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server running on port 4000"));

function axiosCall() {
  axios
    // .post("users", {
    //   name: "abdullah ibn haleemah",
    // })
    .get("users?name=abdullah ibn haleemah")
    // .get("users", {
    //   params: {
    //     name: "abdullah ibn haleemah",
    //   },
    // })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

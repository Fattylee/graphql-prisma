import { GraphQLServer, PubSub } from "graphql-yoga";
import path from "path";
import { users, posts, comments } from "./db";
import {
  Comment,
  Mutation,
  Post,
  Query,
  User,
  Subscription,
} from "./resolvers";
import prisma from "../prisma";

const typeDefs = path.join(__dirname, "./schema.graphql");
const resolvers = { Comment, Mutation, Post, Query, User, Subscription };

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    users,
    posts,
    comments,
    pubsub,
    prisma,
  },
});

server.start({ port: 5000 }, ({ playground, port }) => {
  console.log("Server is up and running! on " + port);
});

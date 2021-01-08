import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      hello: {
        args: { name: { type: GraphQLString } },
        type: GraphQLString,
        resolve(_, { name }) {
          console.log(name);
          return `hello, ${name || "world"}`;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    fields: {
      create: {
        type: GraphQLString,
        args: { email: { type: GraphQLNonNull(GraphQLString) } },
        resolve(_, { email }) {
          return;
          return "see me " + email;
        },
      },
    },
  }),
});
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);
app.get("/", (req, res) => {
  res.send("Hello graphQL!!!");
});
const port = process.env.PORT || 4200;
app.listen(port, console.log("Server running on port", port));
const query = `
  mutation {
    create(email:"hello@")
  }
`;
graphql(schema, query).then(console.log);

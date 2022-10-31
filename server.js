//const {} = require("graphql");
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./middleware/contextMiddleware");

const MONGODB_URI =
  "mongodb+srv://Sayan:sayantelaverge8617@cluster0.qoxknoi.mongodb.net/Chat?retryWrites=true&w=majority";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: contextMiddleware,
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen().then(({ url }) => {
      console.log("Server Listens to : ", url);
    });
  })
  .catch((err) => {
    console.log(err);
  });

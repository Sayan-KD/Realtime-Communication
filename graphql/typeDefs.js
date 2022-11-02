const { gql } = require("apollo-server");

module.exports = gql`
  type Users {
    userName: String!
    email: String!
    token: String
  }
  type Message {
    content: String!
    from: String
    to: String!
  }
  type Query {
    getUsers: [Users]!
    login(userName: String!, password: String!): Users!
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    register(
      email: String!
      userName: String!
      password: String!
      confirmPassword: String
    ): Users!
    sendMessage(to: String!, content: String!): Message!
  }
`;

const { gql } = require("apollo-server");

module.exports = gql`
  type Message {
    content: String!
    from: String
    to: String!
  }
  type Users {
    userName: String!
    email: String
    token: String
    latestMessage: [Message]!
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

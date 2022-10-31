const { gql } = require("apollo-server");

module.exports = gql`
  type Users {
    userName: String!
    email: String!
    token: String
  }

  type Query {
    getUsers: [Users]!
    login(email: String!, password: String!): Users!
  }
  type Mutation {
    register(
      email: String!
      userName: String!
      password: String!
      confirmPassword: String
    ): Users!
  }
`;

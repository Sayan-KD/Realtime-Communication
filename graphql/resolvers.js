const { UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      return await User.find({ email: { $ne: user.email } });
    },
    login: async (_, args) => {
      const { email, password } = args;
      let errors = {};
      if (email.trim() === "") errors.username = "username must not be empty";
      if (password === "") errors.password = "password must not be empty";

      if (Object.keys(errors).length > 0) {
        throw new UserInputError("bad input", { errors });
      }

      const user = await User.findOne({ email: email, password: password });
      if (!user) {
        errors.username = "user not found";
        throw new UserInputError("user not found", { errors });
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { ...user.toJSON(), token };
    },
  },
  Mutation: {
    register: (_, args) => {
      // const hashPw = await bcrypt.hash(args.userInput.password, 12);
      const { userName, email, password, confirmPassword } = args;
      let errors = {};
      if (email.trim() === "") errors.email = "email must not be empty";
      if (userName.trim() === "")
        errors.username = "username must not be empty";
      if (password.trim() === "")
        errors.password = "password must not be empty";
      if (confirmPassword.trim() === "")
        errors.confirmPassword = "repeat password must not be empty";

      if (password !== confirmPassword)
        errors.confirmPassword = "passwords must match";

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      const user = new User({
        userName: userName,
        email: email,
        password: password,
      });
      const createUser = user.save();
      return createUser;
    },
  },
};

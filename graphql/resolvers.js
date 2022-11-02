const { UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Message = require("../models/Message");

Message;
dotenv.config();
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      return await User.find({ email: { $ne: user.email } });
    },
    login: async (_, args) => {
      const { userName, password } = args;
      let errors = {};
      if (userName.trim() === "")
        errors.username = "username must not be empty";
      if (password === "") errors.password = "password must not be empty";

      if (Object.keys(errors).length > 0) {
        throw new UserInputError("bad input", { errors });
      }

      const user = await User.findOne({
        userName: userName,
        password: password,
      });
      if (!user) {
        errors.username = "user not found";
        throw new UserInputError("user not found", { errors });
      }
      const token = jwt.sign({ userName }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { ...user.toJSON(), token };
    },

    getMessages: async (parent, { from }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const otherUser = await User.findOne({
        userName: from,
      });
      if (!otherUser) throw new UserInputError("User not found");

      const usernames = [user.userName, otherUser.userName];

      const messages = await Message.find({
        from: { $in: usernames },
        to: { $in: usernames },
      }).sort({ _id: -1 });

      return messages;
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

    sendMessage: async (parent, args, { user }) => {
      const { to, content } = args;
      if (!user) throw AuthenticationError("Unauthenticated!!");
      const recipient = await User.findOne({ userName: to });

      if (!recipient) {
        throw new UserInputError("User not found");
      } else if (recipient.userName === user.userName) {
        throw new UserInputError("You cant message yourself");
      }
      if (content.trim() === "") {
        throw new UserInputError("Message is empty");
      }
      console.log(user);
      const message = await Message({
        content: content,
        from: user.userName,
        to: to,
      }).save();

      return message;
    },
  },
};

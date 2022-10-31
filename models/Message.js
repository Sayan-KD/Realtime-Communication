const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = MessageSchema;

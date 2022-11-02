const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  from: { type: String },
  to: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);

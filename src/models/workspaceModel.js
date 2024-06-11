const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for your workspace."],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String,
  },
  bgImage: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "A workspace should have a creator"],
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;

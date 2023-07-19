const mongoose = require("mongoose");

const UserModel = mongoose.model("User", {
  username: String,
  password: String,
  bookmarksStories: [],
});
module.exports = UserModel;

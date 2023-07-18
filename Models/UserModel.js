const mongoose = require("mongoose");

const UserModel = mongoose.model("User", {
  username: String,
  password: String,
});
module.exports = UserModel;

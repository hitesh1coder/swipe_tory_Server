const UserModel = require("../Models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.send({
        status: "failed",
        message: "This user already exists",
      });
    }

    if (username && password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        username,
        password: encryptedPassword,
      });

      const jwtToken = jwt.sign(
        { username, password: encryptedPassword },
        process.env.JWT_SECRECT_KEY,
        { expiresIn: 6000 }
      );
      return res.send({
        username: user.username,
        status: "success",
        userid: user._id,
        message: "User Registered successfully",
        token: jwtToken,
        bookmarks: user.bookmarksStories,
      });
    } else {
      res.send({ status: "fail", message: "All fields required" });
    }
  } catch (error) {
    res.status(500).send({ status: "fail", message: "Something went wrong" });
  }
};

// login User

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      const matchPassword = await bcrypt.compare(password, user.password);

      if (matchPassword) {
        const jwtToken = jwt.sign({ username }, process.env.JWT_SECRECT_KEY, {
          expiresIn: 6000,
        });

        res.status(200).send({
          username: user.username,
          status: "success",
          userid: user._id,
          message: "User logged in successfully",
          token: jwtToken,
          bookmarks: user.bookmarksStories,
        });
      } else {
        res.status(501).send({
          status: "failed",
          message: "Credentials did not match",
        });
      }
    } else {
      res.status(502).send({
        status: "failed",
        message: "This username is not registered",
      });
    }
  } catch (error) {
    res.status(503).send({
      status: "failed",
      message: "Incorrect credentials",
    });
  }
};

module.exports = { registerUser, loginUser };

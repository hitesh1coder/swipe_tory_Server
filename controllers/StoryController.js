const StoryModel = require("../Models/StoryModel.js");
const UserModel = require("../Models/UserModel.js");

const createStory = async (req, res) => {
  try {
    const forms = req.body.forms;

    if (forms.length < 2) {
      res.status(400).json({ message: "No forms found" });
      return;
    }
    const result = await StoryModel.create(forms);
    res.status(200).json({ message: "Forms saved successfully" });
  } catch (error) {
    console.error("Error saving forms:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Get all Story

const getAllStory = async (req, res) => {
  try {
    const story = await StoryModel.find();
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json(error);
  }
};
// get filter Stories
const getFilteredStories = async (req, res) => {
  try {
    let category = req.query.category || "";

    const filterStories =
      category === "all"
        ? await StoryModel.find()
        : await StoryModel.find({ category });

    return res.status(200).json(filterStories);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getSingleStory = async (req, res) => {
  const { id } = req.params;

  try {
    const story = await StoryModel.findById(id);
    // const singlePost = story.story[0]._id;
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addToBookmark = async (req, res) => {
  const storyData = req.body.storyData;
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);
    console.log(user);
    await user.updateOne({ $push: { bookmarksStories: storyData } });

    res.status(200).json({
      status: "Saved to Bookmarks",
      bookMarkedStories: user.bookmarksStories,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
// Update a story
const updateStory = async (req, res) => {
  const storyId = req.params.id;
  const { userId } = req.body;

  try {
    const story = await StoryModel.findById(storyId);

    if (story.userId === userId) {
      await story.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a story
const likeStory = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const story = await StoryModel.findById(id);
    const isLiked = story.likes.includes(userId);
    if (isLiked) {
      await story.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ status: "Liked", storyLikes: story.likes });
    } else {
      await story.updateOne({ $push: { likes: userId } });
      res.status(200).json({ status: "unliked", storyLikes: story.likes });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCurrentUserStories = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const currentUserStories = await StoryModel.find({ userId });
    res
      .status(200)
      .json(currentUserStories.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createStory,
  updateStory,
  getAllStory,
  getSingleStory,
  getFilteredStories,
  likeStory,
  getCurrentUserStories,
  addToBookmark,
};

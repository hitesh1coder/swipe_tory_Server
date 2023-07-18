const StoryModel = require("../Models/StoryModel.js");

const createStory = async (req, res) => {
  // const storySlide = new StoryModel({
  //   category,
  //   imageurl,
  //   description,
  //   heading,
  //   likes: userId,
  // });

  // const story = [storySlide, storySlide, storySlide];
  //   // Define a schema for the forms
  // const FormSchema = new mongoose.Schema({
  //   name: String,
  //   email: String,
  //   message: String
  // });

  // const Form = mongoose.model('Form', FormSchema);

  // // Handle POST request
  // app.post("/forms", async (req, res) => {
  try {
    const forms = req.body.forms;

    if (forms.length < 2) {
      res.status(400).json({ message: "No forms found" });
      return;
    }

    // for (const story of forms) {
    //   const newStory = new StoryModel(story);
    //   const result = await newStory.save();
    // }
    const result = await StoryModel.create(forms);
    // console.log(result);

    res.status(200).json({ message: "Forms saved successfully" });
  } catch (error) {
    console.error("Error saving forms:", error);
    res.status(500).json({ error: "An error occurred" });
  }

  // try {
  //   const newStory = new StoryModel({
  //     userId: req.params.id,
  //     story,
  //   });
  //   const result = await newStory.save();
  //   res.status(200).json({ message: "Stories Created", res: result });
  // } catch (error) {
  //   res.status(500).json(error);
  // }
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

// Update a story
const updateStory = async (req, res) => {
  const storyId = req.params.id;
  const { userId } = req.body;

  try {
    const story = await StoryModel.findById(storyId);
    console.log(story);
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

// // Delete a story
//  const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const { userId } = req.body;

//   try {
//     const story = await StoryModel.findById(id);
//     if (story.userId === userId) {
//       await story.deleteOne();
//       res.status(200).json("POst deleted successfully");
//     } else {
//       res.status(403).json("Action forbidden");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

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
};

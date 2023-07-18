const express = require("express");
const {
  createStory,
  getAllStory,
  updateStory,
  likeStory,
  getCurrentUserStories,
  getFilteredStories,
  getSingleStory,
} = require("../controllers/StoryController");
const router = express.Router();

router.post("/create/:id", createStory);
router.get("/singlestory/:id", getSingleStory);
router.get("/", getAllStory);
router.get("/category", getFilteredStories);
router.put("/update/:id", updateStory);
router.put("/like/:id", likeStory);
router.get("/:id/mystory", getCurrentUserStories);

module.exports = router;

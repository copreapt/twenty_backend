const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createLike,
  getLikes,
  deleteLike,
  getCurrentUserLikes,
} = require("../controllers/likesController");

router.route("/").post(authenticateUser, createLike).get(getLikes);
router.route("/currentUserLikes").get(authenticateUser, getCurrentUserLikes);
router
  .route("/:id")
  .delete(authenticateUser, deleteLike);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");

router.route("/").post(authenticateUser, createComment).get(getComments);
// router.route("/").post(createComment).get(getComments);

router
  .route("/:id")
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;
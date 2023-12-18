const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getLastComment,
  getCurrentUserComments,
} = require("../controllers/commentsController");

router.route("/").post(authenticateUser, createComment)
router.route("/getCurrentPostComments").post(getComments);
router.route("/getLastComment").post(getLastComment);
router.route("/getCurrentUserComments").post(authenticateUser,getCurrentUserComments);

router
  .route("/:id")
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  authenticateUser,
} = require("../middleware/authentication");

const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  uploadImage,
  uploadVideo,
} = require("../controllers/postController");

router
  .route("/")
  .post(authenticateUser, createPost)

router
  .route("/getAllPosts")
  .post(getAllPosts);

router
  .route("/uploadImage")
  .post(authenticateUser, uploadImage)

router.route("/uploadVideo")
  .post(authenticateUser, uploadVideo);

router
  .route("/:id")
  .get(getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);


module.exports = router;

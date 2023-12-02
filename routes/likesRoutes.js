const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createLike,
  getLikes,
  deleteLike,
} = require("../controllers/likesController");

router.route("/").post(authenticateUser, createLike).get(getLikes);
// router.route("/").post(createLike).get(getLikes);

router
  .route("/:id")
  .delete(authenticateUser, deleteLike);

module.exports = router;

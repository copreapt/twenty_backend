const express = require("express");
const router = express.Router();
const {
  authenticateUser,
} = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadImage,
  addFriend
} = require("../controllers/userController");

router
  .route("/")
  .get(authenticateUser,getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);

router.route("/updateUser").patch(authenticateUser, updateUser);

router.route("/uploadImage").post(authenticateUser, uploadImage);

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/addFriend").patch(authenticateUser, addFriend);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;

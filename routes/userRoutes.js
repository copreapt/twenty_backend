const express = require("express");
const router = express.Router();
const {updateUserPassword, getAllUsers, showCurrentUser, updateUser, getSingleUser} = require('../controllers/userController')
const authenticateUser = require('../middleware/authentication')

router
  .route("/")
  .get(authenticateUser, getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;    


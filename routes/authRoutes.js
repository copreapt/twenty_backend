const express = require('express');
const router = express.Router();
const {register, login, logout, verifyEmail} = require('../controllers/authController');
const  {authenticateUser}  = require("../middleware/authentication");

router.post("/register", register);
router.post("/login", login);
router.get("/logout",authenticateUser, logout);
router.post('/verify-email', verifyEmail);

module.exports = router;
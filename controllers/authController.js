const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require("../utils");
const crypto = require('crypto');

const register = async (req, res) => {
  const { email, fullName, password, username } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

// set up fake token before creating user

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({ fullName, email, password, username, verificationToken });

  // origin is the target url, where the user will navigate once the link in the email is clicked 

  const origin = 'http://localhost:5173';

  await sendVerificationEmail({fullName: user.fullName, email: user.email, verificationToken: user.verificationToken, origin});

// send verification token back only while testing in postman!!!

  res.status(StatusCodes.CREATED).json({ msg:'Success! Please check your email to verify the account' });
};


const verifyEmail = async(req,res) => {
  const {verificationToken, email} = req.body;
  const user = await User.findOne({email});
  if(!user){
    throw new CustomError.UnauthenticatedError('Verification failed');
  }
  if(user.verificationToken !== verificationToken){
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  user.isVerified = true;
  user.verified = Date.now();
// we set verification token back to empty once the email was verified meaning email can only be verified once
  user.verificationToken = '';

  await user.save()

  res.status(StatusCodes.OK).json({msg:'Email Verified'});
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  if(!user.isVerified){
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
};

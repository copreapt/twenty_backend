const User = require("../models/User");
const Token = require('../models/Token');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetPasswordEmail, createHash } = require("../utils");
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

  const origin = "https://twenty-media.netlify.app";
  // const origin = "http://localhost:5173";

  await sendVerificationEmail({fullName: user.fullName, email: user.email, verificationToken: user.verificationToken, origin});

// send verification token back only while testing in postman!!!

  res.status(StatusCodes.CREATED).json({ msg:'Account Created! Please check your email to verify the account' });
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

  // create refresh token;
  let refreshToken = '';

  // check for existing token

const existingToken = await Token.findOne({user:user._id});

if(existingToken){
// check if isValid is true, if i want to logout a user, I'll just set in database isValid to false
  const {isValid} = existingToken
  if(!isValid) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
// is there is already an existing token, instead of creating a new one, we use the one from database
  refreshToken = existingToken.refreshToken
// we don't need to check for userAgent, ip or useToken, because we already have that in the database so we just attach the cookies
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });

// return so js doesn't keep reading the rest of the code
  return;
}

// assuming there is no refresh token yet, we create the token
refreshToken = crypto.randomBytes(40).toString('hex')
const userAgent = req.headers['user-agent']
const ip = req.ip
// in userToken we pass the values needed to create the Token (all values from Token model)
const userToken = {refreshToken,ip,userAgent,user:user._id}

await Token.create(userToken);




  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser});
};

const logout = async (req, res) => {

  await Token.findOneAndDelete({user:req.user.userId})

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    domain: "twenty-media.netlify.app",
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    domain: "twenty-media.netlify.app",
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "Logged out" });
};

const forgotPassword = async (req,res) => {
  const {email} = req.body;
  // we won't check if the email exists in the database and send success response regardless, so whoever is trying to reset the password won't know if the email exists or not
  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }

  const user = await User.findOne({email});

  if(user){
    const passwordToken = crypto.randomBytes(70).toString('hex');
    // send email
    const origin = "https://twenty-media.netlify.app";
    // const origin = "http://localhost:5173";
    await sendResetPasswordEmail({fullName:user.fullName, email:user.email,token:passwordToken, origin})

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

  }
  res.status(StatusCodes.OK).json({msg:'Please check your email for reset password link'});
}

const resetPassword = async (req, res) => {
  const {token,email,password} = req.body;
  if(!token || !email || !password){
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({email});

  if(user){
    const currentDate = new Date()
    if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate){
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! Redirecting to login page" });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

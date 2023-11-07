const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errors');
const {attachCookiesToResponse, createTokenUser, createHash} = require('../utils')
const crypto = require('crypto');




const register = async (req, res) => {
  const { email, fullName, password, username } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    verificationToken,
  });
  // const origin = "http://localhost:3000";
  // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

  // const tempOrigin = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');

  // await sendVerificationEmail({
  //   name: user.name,
  //   email: user.email,
  //   verificationToken: user.verificationToken,
  //   origin,
  // });
  // send verification token back only while testing in postman!!!
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",user:user,
  });
};

const verifyEmail = async (req, res) => {
  res.send("email verify");
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = '';
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
 await Token.findOneAndDelete({user: req.user.userId});
 
 res.cookie("accessToken", "logout", {
   httpOnly: true,
   expires: new Date(Date.now()),
 });
 res.cookie("refreshToken", "logout", {
   httpOnly: true,
   expires: new Date(Date.now()),
 });
 res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { register, verifyEmail, login, logout };

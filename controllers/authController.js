const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errors');
const jwt = require("jsonwebtoken");



const register = async (req, res) => {
  const {email, fullName, username, password} = req.body;
// check if email already exists
  const emailAddressExists = await User.findOne({ email });
  if(emailAddressExists){
    throw new CustomError.BadRequestError('Email already exists');
  }
  const user = await User.create({email, fullName, username, password});
  const token = jwt.sign({user}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
   });
  res.status(StatusCodes.CREATED).json({msg:'Success! Please check your email to verify the account', token});
};

const verifyEmail = async (req, res) => {
  res.send("email verify");
};

const login = async (req, res) => {
  const {email, password} = req.body;
if(!email || !password){
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({email});
if(!user){
  throw new CustomError.UnauthenticatedError('Invalid Credentials');
}
  const isPasswordCorrect = await user.comparePassword(password);
if(!isPasswordCorrect){
  throw new CustomError.UnauthenticatedError('Invalid Credentials');
}
  const token =  jwt.sign({user}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  res.status(StatusCodes.OK).json({msg:`Welcome ${user.username}`,token});
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly:true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({msg: "user logged out"});
};

module.exports = { register, verifyEmail, login, logout };

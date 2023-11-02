const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../errors');


const register = async (req, res) => {
  const {email, fullName, username, password} = req.body;
// check if email already exists
  const emailAddressExists = await User.findOne({ email });
  if(emailAddressExists){
    throw new CustomError.BadRequestError('Email already exists');
  }

  const user = await User.create({email, fullName, username, password});
  token = user.createJWT()
  res.status(StatusCodes.CREATED).json({msg:'Success! Please check your email to verify the account', user:user});
};

const verifyEmail = async (req, res) => {
  res.send("email verify");
};

const login = async (req, res) => {
  const user = req.body
  res.status(StatusCodes.OK).json({user})
};

const logout = async (req, res) => {
  res.send("logout user");
};

module.exports = { register, verifyEmail, login, logout };

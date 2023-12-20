const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getAllUsers = async (req, res) => {
  const users = await User.find({ }).select("-password");
  res.status(StatusCodes.OK).json({ users: users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const currentUserId = req.user.userId;
  const user = await User.findOne({_id: currentUserId}).select("-password");
  res.status(StatusCodes.OK).json({ user});
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "twenty",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const updateUser = async (req, res) => {
  const { email, fullName, username, profilePicture } = req.body;
  const {userId: id} = req.user.userId;

  if(!email, !fullName, !username, !profilePicture){
    throw CustomError.BadRequestError('Please provide all values')
  }

 const updatedUser = await User.findOneAndUpdate({ _id: id }, {
  email, fullName, username, profilePicture,
 });

 if(!updatedUser){
  throw CustomError.BadRequestError(`There is no user with id: ${id}`);
 }

  const tokenUser = createTokenUser(updatedUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({user: updatedUser});
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadImage,
};

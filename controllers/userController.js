const User = require("../models/User");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
} = require("../utils");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users: users });
};

const searchUsers = async (req,res) => {
  const {search} = req.query;
  if(!search){
   return res.status(StatusCodes.OK).json({})
  }
  const result = await User.find({
    fullName: { $regex: search, $options: "i" },
  });
  return res.status(StatusCodes.OK).json({ result });
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  const posts = await Post.find({user: req.params.id});
  res.status(StatusCodes.OK).json({ user, posts });
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
  const { fullName, username, profilePicture, facebook, instagram, twitter, job, location} = req.body;

  if(!fullName, !username, !profilePicture){
    throw new CustomError.BadRequestError('Please provide all values')
  }

 const updatedUser = await User.findOne({ _id: req.user.userId });


 updatedUser.fullName = fullName;
 updatedUser.username = username;
 updatedUser.profilePicture = profilePicture;
 updatedUser.facebook = facebook;
 updatedUser.instagram = instagram;
 updatedUser.twitter = twitter;
 updatedUser.job = job;
 updatedUser.location = location;

 await updatedUser.save()

//  find all the posts and comments of this user, and update full name and profile picture

const updatePosts = await Post.updateMany({user: req.user.userId}, {
  name: fullName,
  profilePicture: profilePicture,
});

const updateLikes = await Likes.updateMany({user: req.user.userId}, {
  name: fullName,
  profilePicture: profilePicture,
});

  const tokenUser = createTokenUser(updatedUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({user: updatedUser, msg:"Profile updated!"});
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

const addFriend = async (req,res) => {
  const { fullName, profilePicture, friendId } = req.body;
  if(!fullName || !profilePicture || !friendId){
    throw new CustomError.BadRequestError("Please provide all values")
  }
  const updatedUser = await User.findOne({_id: req.user.userId});
  const newFriend = {
    fullName,
    profilePicture,
    friendId,
  }
  updatedUser.friends = [...updatedUser.friends, newFriend];
  await updatedUser.save()
  res
    .status(StatusCodes.OK)
    .json({ user: updatedUser, msg: `${fullName} has been added to your friend list` });
}



module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadImage,
  addFriend,
  searchUsers,
};

const Likes = require("../models/Likes");
const Post = require('../models/Post');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");


const createLike = async (req,res) => {
    const {post: postId} = req.body;
    const isValidPost = await Post.findOne({_id: postId});
    if(!isValidPost){
        throw new CustomError.NotFoundError(`No post with id: ${postId}`);
    }
    const alreadySubmitted = await Likes.findOne({
      post: postId,
      user: req.user.userId,
    });
// if like already exists, next time user presses on like button, we remove the like
    if (alreadySubmitted) {
      const deleteLike = await Likes.findOneAndDelete({
        post: postId,
        user: req.user.userId,
      })
      return res.status(StatusCodes.OK).json({ msg: "Success! Like deleted" });
    };

    req.body.user = req.user.userId;
    const like = await Likes.create(req.body);  
    res.status(StatusCodes.CREATED).json({msg: "Success"});
};

const getLikes = async (req,res) => {
    const allLikes = await Likes.find({});
    res.status(StatusCodes.OK).json({ allLikes });
};

const getCurrentUserLikes = async(req,res) => {
  const userId = req.user.userId;
  const currentUserLikes = await Likes.find({ user: userId });
  res.status(StatusCodes.OK).json({ currentUserLikes });
}

const getCurrentPostLikes = async(req,res) => {
  const {post: postId} = req.body;
  const currentPostLikes = await Likes.find({post: postId});
  if(!currentPostLikes){
    return res.status(StatusCodes.OK).json({msg: "No likes yet for this post"});
  }
  res.status(StatusCodes.OK).json({currentPostLikes});
}

const deleteLike = async(req,res) => {
    const {id: likeId} = req.params;
    const like = await Likes.findOneAndDelete({_id: likeId});
    if (!like) {
      throw new CustomError.NotFoundError(`No like with id ${likeId}`);
    }
    res.status(StatusCodes.OK).json({msg:"Success! Like removed"});
};



module.exports = {
    createLike,
    getLikes,
    getCurrentUserLikes,
    getCurrentPostLikes,
    deleteLike,
}





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

    if (alreadySubmitted) {
      throw new CustomError.BadRequestError(
        "Already submitted like for this post"
      );
    }

    req.body.user = req.user.userId;
    const like = await Likes.create(req.body);  
    res.status(StatusCodes.CREATED).json({});
};

const getLikes = async (req,res) => {
    const {post: postId} = req.body
    const likes = await Likes.find({post: postId});
    if (!likes) {
      throw new CustomError.NotFoundError(`There are no likes for post with id ${postId}`);
    }
    res.status(StatusCodes.OK).json({likes});
};

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
    deleteLike,
}





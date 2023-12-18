const Comments = require("../models/Comments");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createComment = async (req, res) => {
   const { post: postId } = req.body;
   const isValidPost = await Post.findOne({ _id: postId });
   if (!isValidPost) {
     throw new CustomError.NotFoundError(`No post with id: ${postId}`);
   }
   req.body.user = req.user.userId;
   const comment = await Comments.create(req.body);
   if(comment){
    const allComments = await Comments.find({post: postId})
    const currentUserCommentsToCurrentPost = await Comments.find({ post: postId, user: req.user.userId })
    return res.status(StatusCodes.CREATED).json({allComments, currentUserCommentsToCurrentPost});
   }
};

const getComments = async (req, res) => {
  const { post: postId } = req.body;
  const comments = await Comments.find({ post: postId });
  res.status(StatusCodes.OK).json({ comments});
};

const getLastComment = async (req,res) => {
  const {post: postId} = req.body;
  const lastComment = await Comments.find({post: postId}).sort({_id: -1}).limit(1);
  res.status(StatusCodes.OK).json({lastComment});
}

const updateComment = async (req,res) => {
    const { id: commentId } = req.params;

    const comment = await Comments.findOneAndUpdate(
      { _id: commentId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!comment) {
      throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
    }
    res.status(StatusCodes.OK).json({comment});
}

const getCurrentUserComments = async (req,res) => {
  const currentUserId = req.user.userId;
  const {post: postId} = req.body;
  const currentUserComments = await Comments.find({post: postId, user: currentUserId});

  res.status(StatusCodes.OK).json({currentUserComments});
}

const deleteComment = async (req, res) => {
  const { id: commentId, postId } = req.params;
  const comment = await Comments.findOneAndDelete({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }
  const currentUserComments = await Comments.find({
    post: postId,
    user: req.user.userId,
  });
  const allComments = await Comments.find({ post: postId });
  res.status(StatusCodes.OK).json({ msg: "Success! Comment removed", allComments, currentUserComments });
};

module.exports = {
  createComment,
  getComments,
  getLastComment,
  getCurrentUserComments,
  updateComment,
  deleteComment,
};

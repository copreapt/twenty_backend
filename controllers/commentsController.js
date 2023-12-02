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
   res.status(StatusCodes.CREATED).json({ comment });
};

const getComments = async (req, res) => {
  const { post: postId } = req.body;
  const comments = await Comments.find({ post: postId });
  res.status(StatusCodes.OK).json({ comments });
};

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

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const comment = await Comments.findOneAndDelete({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Success! Comment removed" });
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};

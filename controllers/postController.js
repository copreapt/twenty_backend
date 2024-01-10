const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


const createPost = async (req, res) => {
    req.body.user = req.user.userId;
    const post = await Post.create(req.body);
    res.status(StatusCodes.CREATED).json({post});
};

const getAllPosts= async (req, res) => {
    const { page, limit } = req.body;
    const pageNumber = Number(page) || 1;
    const limitResult = Number(limit) || 4  ;
    const skip = (pageNumber - 1) * limitResult;
    const posts = await Post.find({}).sort({ createdAt: "desc" }).skip(skip).limit(limitResult);
    if(posts.length < 1){
    return res.status(StatusCodes.OK).json({})
    }
    res.status(StatusCodes.OK).json({posts});
};

const getSinglePost = async (req, res) => {
    const {id: postId} = req.params;
    const  post = await Post.findOne({_id: postId})
    if(!post){
        throw new CustomError.NotFoundError(`No post with id: ${postId}`);
    }
    res.status(StatusCodes.OK).json({post});
};

const updatePost = async (req, res) => {
    const {id: postId} = req.params;
    const post = await Post.findOneAndUpdate({_id: postId}, req.body, {
        new:true,
        runValidators: true,
    });
    if(!post){
        throw new CustomError.NotFoundError(`No post with id: ${postId}`);
    }
    res.status(StatusCodes.OK).json({post});
};

const deletePost = async (req, res) => {
    const {id: postId} = req.params;
    const post = await Post.findOneAndDelete({_id: postId});
    if(!post){
        throw new CustomError.NotFoundError(`No post with id: ${postId}`)
    }
    res.status(StatusCodes.OK).json({msg: 'Success! Post removed!'});
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
    return res
      .status(StatusCodes.OK)
      .json({ image: { src: result.secure_url } });
};

const uploadVideo = async (req, res) => {
    res.send("upload video");
};


module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    uploadImage,
    uploadVideo,
}
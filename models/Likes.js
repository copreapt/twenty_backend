const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    isPostLiked: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


module.exports = mongoose.model("Likes", LikesSchema);

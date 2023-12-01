const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    location: {
      type: String,
      default: 'Somewhere',
    },
    profilePicture: {
      type: String,
    },
    video: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);



module.exports = mongoose.model("Post", PostSchema);
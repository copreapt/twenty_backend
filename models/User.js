const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  fullName: {
    type: String,
    required: [true, "Please provide full name"],
    minlength: 3,
    maxlength: 50,
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/drprikq7j/image/upload/v1700931427/twenty/tmp-1-1700931426678_vjk5dz.jpg",
  },
});


UserSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
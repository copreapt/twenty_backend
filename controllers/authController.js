const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  res.send("register user");
};

const verifyEmail = async (req, res) => {
  res.send("email verify");
};

const login = async (req, res) => {
  const user = req.body
  res.status(StatusCodes.OK).json({user})
};

const logout = async (req, res) => {
  res.send("logout user");
};

module.exports = { register, verifyEmail, login, logout };

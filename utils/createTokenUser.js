const createTokenUser = (user) => {
  return { fullName: user.fullName, userId: user._id, username: user.username  };
};

module.exports = createTokenUser;

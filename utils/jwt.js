const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};


const isTokenValid = ( token ) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: {user} });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30 ;

  res.cookie("accessToken", accessTokenJWT, {
    expires: new Date(Date.now() + oneDay),
    signed: true,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    expires: new Date(Date.now() + longerExp),
    signed:true,
  });

};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

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

  // DEVELOPMENT

  res.cookie("accessToken", accessTokenJWT, {
    expires: new Date(Date.now() + oneDay),
    signed: true,
  });


  res.cookie("refreshToken", refreshTokenJWT, {
    expires: new Date(Date.now() + longerExp),
    signed:true,
  });

  // PRODUCTION

  // res.cookie("accessToken", accessTokenJWT, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay),
  //   sameSite: "none",
  //   secure: true,
  //   signed: true,
  //   domain: "twenty-media.netlify.app",
  // });

  // res.cookie("refreshToken", refreshTokenJWT, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + longerExp),
  //   sameSite: "none",
  //   secure: true,
  //   signed: true,
  //   domain: "twenty-media.netlify.app",
  // });

};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

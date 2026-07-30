const jwt = require("jsonwebtoken");

const generateUserToken = (user) => {
  return jwt.sign(
    {
       id: user.id,
      role: user.role,
      photo: user.photo,

    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

module.exports = generateUserToken;
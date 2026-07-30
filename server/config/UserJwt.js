const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
       id: user.id,
      role: user.role,
      company_id: user.company_id,
      photo: user.photo,

    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

module.exports = generateToken;
const jwt = require("jsonwebtoken");

const generateToken = (admin) => {
  return jwt.sign(
    {
       id: admin.id,
      role: admin.role,
      company_id: admin.company_id,
      photo: admin.photo,

    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

module.exports = generateToken;
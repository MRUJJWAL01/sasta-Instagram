const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { username, password, email, fullName, mobile } = req.body;
    if ((!email && !mobile) || (email && mobile)) {
      return res.status(400).json({
        msg: "Provide exactly one of email or mobile",
      });
    }
    const query = [{ username }];
    if (email) query.push({ email });
    if (mobile) query.push({ mobile });
    let existUser = await UserModel.findOne({ $or: query });
    if (existUser) {
      return res.status(409).json({
        msg: "user already exist",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      fullName,
      email,
      password: hashPass,
      mobile,
    });

    if (!user) {
      return res.status(401).json({
        msg: "error in creating user",
      });
    }
    const token = await user.JWTTokenGeneration();
    res.cookie("token", token, { expire: "1h" });
    return res.status(201).json({
      msg: "user created",
      user: user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "internal error",
      error: error,
    });
  }
};

module.exports = registerController;

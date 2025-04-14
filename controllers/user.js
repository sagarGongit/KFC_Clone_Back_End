const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJs = require("crypto-js");
const userModel = require("../models/user");
const tokenModel = require("../models/blacklistedTokens");

const RegisterUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(409).json({
      message: "user already exist please login",
    });
  }
  try {
    const hashed = await bcrypt.hash(password, 3);
    const newUser = new userModel({
      name,
      email,
      password: hashed,
      phone,
    });
    await newUser.save();
    res.json({
      message: "user register successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const DecryptPayload = (payload) => {
  const secretKey = process.env.DECRYPT_KEY;
  if (!secretKey) {
    throw new Error("secretKey is not defined !");
  }
  const decryptByte = CryptoJs.AES.decrypt(payload, secretKey);
  const decrypted = decryptByte.toString(CryptoJs.enc.Utf8);
  return JSON.parse(decrypted);
};

const UserSignIn = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({
      message: "invalid data",
    });
  }
  try {
    const decrypted = DecryptPayload(data);
    const { email, password } = decrypted;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        massage: "user not found please register",
      });
    }
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return res.json({
        message: "login successful..",
        token,
        name: user.name,
        user_id: user._id,
      });
    } else {
      res.status(401).json({
        message: "invalid credientials!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const UserLogout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const newToken = new tokenModel({
      token,
    });
    await newToken.save();
    return res.json({
      message: "user logout successfully",
      blacklistToken: newToken,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  RegisterUser,
  UserSignIn,
  UserLogout,
};

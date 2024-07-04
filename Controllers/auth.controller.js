import { errorHandler } from "../Utils/error.js";
import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashpass = bcryptjs.hashSync(password, 10);
  const createUser = await User({ username, email, password: hashpass });
  try {
    await createUser.save();
    res.status(200).json("User has created successfully");
  } catch (error) {
    next(
      errorHandler(401, "Ensure you type correct or please use Unique words")
    );
  }
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const CheckEmail = await User.findOne({ email });
    if (!CheckEmail) return next(errorHandler(401, "User not found"));
    const CheckPass = bcryptjs.compareSync(password, CheckEmail.password);
    if (!CheckPass) return next(errorHandler(401, "Credential not found"));
    const token = jwt.sign({ id: CheckEmail._id }, process.env.JWT);
    const { password: sec, ...rest } = CheckEmail._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const Google = async (req, res, next) => {
  const finduser = await User.findOne({ email: req.body.email });
  if (finduser) {
    const token = jwt.sign({ id: finduser._id }, process.env.JWT);
    const { password: sec, ...rest } = finduser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  }
  try {
    const GeneratePass =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const Secpass = bcryptjs.hashSync(GeneratePass, 10);
    const newUser = await User.create({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: Secpass,
      avatar: req.body.photo,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    const { password: sec, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const Signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been signout");
  } catch (error) {}
};

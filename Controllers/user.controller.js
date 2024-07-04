import Listing from "../Models/listing.model.js";
import User from "../Models/user.model.js";
import { errorHandler } from "../Utils/error.js";
import bcryptjs from "bcryptjs";

export const UpdateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only update your own account"));
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const Updateuser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password: secpass, ...rest } = Updateuser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const Deleteuser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete you own Account"));
  try {
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};

export const GetListing = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only see your own listing"));
    const listing = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password: sec, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

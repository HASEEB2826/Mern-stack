import { start } from "init";
import Listing from "../Models/listing.model.js";
import { errorHandler } from "../Utils/error.js";

export const CreateListing = async (req, res, next) => {
  try {
    const creatListing = await Listing.create(req.body);
    res.status(200).json(creatListing);
  } catch (error) {
    next(errorHandler(401, "Listing is already exists"));
  }
};

export const DeleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(403, "You can only delete You own listing"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const UpdateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(403, "You can only update your own"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only Update your own listing"));
  try {
    const updatelisting = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatelisting);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = req.query.limit || 9;
    const startIndex = req.query.startIndex || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "created_at";
    const order = req.query.order || "desc";

    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      furnished,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
   
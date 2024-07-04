import express from "express";
import { verifyToken } from "../Utils/verifytoken.js";
import {
  CreateListing,
  DeleteListing,
  UpdateListing,
  getListing,
  getListings,
} from "../Controllers/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, CreateListing);
router.delete("/delete/:id", verifyToken, DeleteListing);
router.post("/update/:id", verifyToken, UpdateListing);
router.get("/getlisting/:id", getListing);
router.get('/get', getListings)

export default router;
  
import express from "express";
import { verifyToken } from "../Utils/verifytoken.js";
import {
  Deleteuser,
  GetListing,
  UpdateUser,
  getUser,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", verifyToken, UpdateUser);
router.delete("/delete/:id", verifyToken, Deleteuser);
router.get("/getlisting/:id", verifyToken, GetListing);
router.get("/get/:id", getUser);

export default router;

import express from "express";
import {
  Google,
  SignIn,
  SignUp,
  Signout,
} from "../Controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/google", Google);
router.get("/signout", Signout);

export default router;

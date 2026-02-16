import express from "express";
import {
  landlordSignUp,
  signIn,
  signOut,
  refreshUserSession,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.post("/refresh", refreshUserSession);

export default router;

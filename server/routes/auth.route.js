import express from "express";
import {
  landlordSignUp,
  landlordSignIn,
  signOut,
  refreshUserSession,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignUp);
router.post("/landlord/sign-in", landlordSignIn);
router.post("/landlord/sign-out", signOut);
router.post("/refresh", refreshUserSession);

export default router;

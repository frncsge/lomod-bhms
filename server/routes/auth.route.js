import express from "express";
import { landlordSignUp } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/emailVerification.controller.js";
import { landlordSignIn } from "../controllers/auth/signin.controller.js";
import { refreshUserSession } from "../controllers/auth/refresh.controller.js";
import { signOut } from "../controllers/auth/signout.controller.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignUp);
router.post("/landlord/sign-in", landlordSignIn);
router.post("/landlord/sign-out", signOut);
router.post("/refresh", refreshUserSession);

export default router;

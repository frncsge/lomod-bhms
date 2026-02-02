import express from "express";
import { landlordSignup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/mailer.controller.js";
import { landlordSignin } from "../controllers/auth/signin.controller.js";
import { getNewAccessToken } from "../controllers/auth/refresh.controller.js";
import { signout } from "../controllers/auth/signout.controller.js";

const router = express.Router();

//landlord auth
router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignup);
router.post("/landlord/sign-in", landlordSignin);
router.post("/landlord/sign-out", signout);

//refresh token
router.post("/refresh", getNewAccessToken);

export default router;

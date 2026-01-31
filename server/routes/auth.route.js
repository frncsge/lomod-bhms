import express from "express";
import { landlordSignup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.controller.js";
import { landlordSignin } from "../controllers/auth/signin.controller.js";

const router = express.Router();

//landlord 
router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignup);
router.post("/landlord/sign-in", landlordSignin);

//refresh token
router.post("/refresh");

export default router;

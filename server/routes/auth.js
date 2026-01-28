import express from "express";
import { landlordSignup } from "../controllers/auth/signup.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.js";
import { landlordSignin } from "../controllers/auth/signin.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", landlordSignup);
router.post("/landlord/sign-in", landlordSignin);

export default router;

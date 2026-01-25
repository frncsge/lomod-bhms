import express from "express";
import { signup } from "../controllers/landlord/auth/signup.js";
import { verifyEmail } from "../controllers/landlord/auth/verifyEmail.js";
import { signin } from "../controllers/landlord/auth/signin.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", signup);
router.post("/landlord/sign-in", signin);

export default router;

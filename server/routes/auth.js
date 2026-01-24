import express from "express";
import { signup } from "../controllers/signup.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

const router = express.Router();

router.get("/landlord/verify-email", verifyEmail);
router.post("/landlord/sign-up", signup);

export default router;

import express from "express";
import { signup } from "../controllers/signup.js";

const router = express.Router();

router.post("/sign-up", signup);

export default router;

import express from "express";
import { post } from "../controllers/post.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/posts", authenticateUser, authorizeUser(["landlord"]), post);

export default router;

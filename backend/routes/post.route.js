import express from "express";
import {
  createPost,
  editPost,
  getPost,
  getPosts,
  getLandlordArchivedPosts,
  getPostsByLandlord,
} from "../controllers/post.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// getting posts
router.get("/posts", authenticateUser, getPosts);
router.get(
  "/posts/archived",
  authenticateUser,
  authorizeUser(["landlord"]),
  getLandlordArchivedPosts,
);
router.get("/posts/:id", authenticateUser, getPost);
router.get(
  "/landlords/:landlordId/posts",
  authenticateUser,
  getPostsByLandlord,
);

// creating post
router.post(
  "/posts",
  authenticateUser,
  authorizeUser(["landlord"]),
  createPost,
);

// editing post
router.patch(
  "/posts/:id",
  authenticateUser,
  authorizeUser(["landlord"]),
  editPost,
);

export default router;

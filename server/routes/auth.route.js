import express from "express";
import {
  landlordSignUp,
  signIn,
  signOut,
  refreshUserSession,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { createTenantAccount, setTenantAccountPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/auth/landlord/verify-email", verifyEmail);
router.post("/auth/landlord/sign-up", landlordSignUp);
router.post("/auth/sign-in", signIn);
router.post("/auth/sign-out", signOut);
router.post("/auth/refresh", refreshUserSession);

router.post("/auth/tenant", authenticateUser, createTenantAccount);
router.patch("/auth/tenant/password", setTenantAccountPassword);

export default router;

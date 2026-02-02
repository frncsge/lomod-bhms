import express from "express";
import { authenticate } from "../middlewares/auth/authenticate.middleware.js";
import { createTenantAccount } from "../controllers/auth/tenant.controller.js";

const router = express.Router();

//tenant account creation done by the landlord
router.post("/tenant", authenticate, createTenantAccount);

export default router;

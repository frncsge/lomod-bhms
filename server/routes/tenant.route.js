import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { createTenantAccount } from "../controllers/tenant.controller.js";

const router = express.Router();

//tenant account creation done by the landlord
router.post("/tenant", authenticateUser, createTenantAccount);

export default router;

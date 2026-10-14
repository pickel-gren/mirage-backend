import { Router } from "express";
import {
  discordCallback,
  getCurrentUser,
  logout,
  refreshSession,
  startDiscordLogin,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get("/discord", startDiscordLogin);
authRouter.get("/callback", discordCallback);
authRouter.post("/refresh", refreshSession);
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/logout", requireAuth, logout);

export default authRouter;

import crypto from "node:crypto";
import {
  exchangeCodeForToken,
  getDiscordAuthorizationUrl,
  getDiscordUser,
} from "../utils/discord.js";
import {
  createSessionToken,
  createRefreshToken,
  SESSION_DURATION_SECONDS,
  REFRESH_DURATION_SECONDS,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  findOrCreateDiscordUser,
  getUserById,
} from "../services/auth.service.js";
import env from "../config/env.js";

const SESSION_COOKIE_NAME = "mirage_session";
const REFRESH_COOKIE_NAME = "mirage_refresh";
const OAUTH_STATE_COOKIE_NAME = "mirage_oauth_state";

const isProduction = env.nodeEnv === "production";

const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
  maxAge: REFRESH_DURATION_SECONDS * 1000,
};

const oauthCookieOptions = {
  httpOnly: true,
  secure: true, // Force true for sameSite: "none"
  sameSite: "none", // Allow cross-site in development
  path: "/",
  maxAge: 10 * 60 * 1000,
};

function serializeUser(user) {
  return {
    id: user.id,
    discordId: user.discordId,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function startDiscordLogin(req, res) {
  if (!env.discord.clientId || !env.discord.clientSecret) {
    return res.status(500).json({
      error: "DISCORD_NOT_CONFIGURED",
      message: "Discord authentication is not configured",
    });
  }

  const state = crypto.randomBytes(32).toString("hex");

  res.cookie(OAUTH_STATE_COOKIE_NAME, state, oauthCookieOptions);

  return res.redirect(getDiscordAuthorizationUrl(state));
}

export async function discordCallback(req, res, next) {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.[OAUTH_STATE_COOKIE_NAME];

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        error: "MISSING_AUTHORIZATION_CODE",
        message: "Discord authorization code is missing",
      });
    }

    if (
      !state ||
      typeof state !== "string" ||
      !storedState ||
      state !== storedState
    ) {
      return res.status(400).json({
        error: "INVALID_OAUTH_STATE",
        message: "OAuth state validation failed",
      });
    }

    const tokenResponse = await exchangeCodeForToken(code);
    const discordUser = await getDiscordUser(tokenResponse.access_token);
    const user = await findOrCreateDiscordUser(discordUser);

    const sessionToken = createSessionToken(user);
    const refreshToken = createRefreshToken(user);

    res.clearCookie(OAUTH_STATE_COOKIE_NAME, oauthCookieOptions);
    res.cookie(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    return res.redirect(env.frontendUrl);
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(req, res) {
  return res.status(200).json({
    user: serializeUser(req.user),
  });
}

export async function refreshSession(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Refresh token is missing",
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const sessionToken = createSessionToken(user);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

    return res.status(200).json({
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);

  return res.status(200).json({
    message: "Logged out successfully",
  });
}

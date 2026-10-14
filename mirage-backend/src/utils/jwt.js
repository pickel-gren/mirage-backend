import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { HttpError } from "./http-error.js";

export const SESSION_DURATION_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function createSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      discordId: user.discordId,
      username: user.username,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtAccessExpiry,
      algorithm: "HS256",
    },
  );
}

export function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtRefreshExpiry,
      algorithm: "HS256",
    },
  );
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    throw new HttpError(
      401,
      "Invalid or expired session token",
      "INVALID_SESSION_TOKEN",
    );
  }
}

export function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    });

    if (payload.type !== "refresh") {
      throw new HttpError(
        401,
        "Invalid refresh token",
        "INVALID_REFRESH_TOKEN",
      );
    }

    return payload;
  } catch (error) {
    throw new HttpError(
      401,
      "Invalid or expired refresh token",
      "INVALID_REFRESH_TOKEN",
    );
  }
}

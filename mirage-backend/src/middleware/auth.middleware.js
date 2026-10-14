import { getUserById } from "../services/auth.service.js";
import { verifySessionToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.mirage_session;

    if (!token) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication is required",
      });
    }

    const payload = verifySessionToken(token);
    const user = await getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User session is invalid",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
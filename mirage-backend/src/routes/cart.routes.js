import { Router } from "express";
import {
  deleteCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get("/", getCart);
cartRouter.put("/items/:productId", updateCartItem);
cartRouter.delete("/items/:productId", deleteCartItem);
cartRouter.delete("/", deleteCart);

export default cartRouter;

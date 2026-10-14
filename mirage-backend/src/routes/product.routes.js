import { Router } from "express";
import {
  getProduct,
  getProducts,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:productId", getProduct);

export default productRouter;
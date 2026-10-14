import {
  getActiveProductById,
  listActiveProducts,
} from "../services/product.service.js";

export async function getProducts(req, res, next) {
  try {
    const requestedCategory = req.query.category;

    const category = requestedCategory
      ? String(requestedCategory).trim().toLowerCase()
      : undefined;

    const productList = await listActiveProducts(category);

    return res.status(200).json({
      products: productList,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await getActiveProductById(req.params.productId);

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return next(error);
  }
}

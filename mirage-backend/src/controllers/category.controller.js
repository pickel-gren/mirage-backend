import { listActiveCategories } from "../services/category.service.js";

export async function getCategories(req, res, next) {
  try {
    const categoryList = await listActiveCategories();

    return res.status(200).json({
      categories: categoryList,
    });
  } catch (error) {
    return next(error);
  }
}

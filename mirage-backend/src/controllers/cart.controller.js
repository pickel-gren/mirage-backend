import {
  clearUserCart,
  getUserCart,
  removeCartItem,
  setCartItemQuantity,
} from "../services/cart.service.js";

export async function getCart(req, res, next) {
  try {
    const cart = await getUserCart(req.user.id);

    return res.status(200).json({ cart });
  } catch (error) {
    return next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body ?? {};

    const cart = await setCartItemQuantity(
      req.user.id,
      req.params.productId,
      quantity,
    );

    return res.status(200).json({ cart });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCartItem(req, res, next) {
  try {
    const cart = await removeCartItem(
      req.user.id,
      req.params.productId,
    );

    return res.status(200).json({ cart });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCart(req, res, next) {
  try {
    const cart = await clearUserCart(req.user.id);

    return res.status(200).json({ cart });
  } catch (error) {
    return next(error);
  }
}

import { Response, Request } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";


export const addToCart = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const {
      productId,
      quantity = 1,
      size,
      color,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const selectedVariant = product.variants.find(
  (variant) => variant.size === size
);

if (!selectedVariant) {
  return res.status(400).json({
    success: false,
    message: "Selected size is not available",
  });
}

if (selectedVariant.stock < quantity) {
  return res.status(400).json({
    success: false,
    message: "Not enough stock available",
  });
}

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            size,
            color,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > selectedVariant.stock) {
  return res.status(400).json({
    success: false,
    message: "Not enough stock available",
  });
}

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          size,
          color,
        });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding to cart",
    });
  }
};


export const getCart = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;  

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cart",
    });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId } = req.params;
    const { quantity, size, color } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const selectedVariant = product.variants.find(
  (variant) => variant.size === size
);

if (!selectedVariant) {
  return res.status(400).json({
    success: false,
    message: "Selected size is not available",
  });
}

if (quantity > selectedVariant.stock) {
  return res.status(400).json({
    success: false,
    message: "Not enough stock available",
  });
}

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating cart",
    });
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId } = req.params;
    const { size, color } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing cart item",
    });
  }
};

export const clearCart = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while clearing cart",
    });
  }
};
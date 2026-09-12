import { Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import { io } from "../server";

// ==========================================
// CREATE ORDER
// ==========================================
export const createOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const {
      shippingAddress,
      deliveryMethod = "standard",
      paymentMethod,
    } = req.body;

    // ------------------------------------------
    // Validate shipping address
    // ------------------------------------------
    if (
      !shippingAddress?.firstName ||
      !shippingAddress?.lastName ||
      !shippingAddress?.email ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping information is required",
      });
    }

    // ------------------------------------------
    // Validate payment method
    // ------------------------------------------
    if (!["card", "cod"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // ------------------------------------------
    // Validate delivery method
    // ------------------------------------------
    if (!["standard", "express"].includes(deliveryMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery method",
      });
    }

    // ------------------------------------------
    // Get user's cart
    // ------------------------------------------
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ------------------------------------------
    // Delivery fee
    // ------------------------------------------
    const deliveryFee =
      deliveryMethod === "express" ? 500 : 0;

    // ------------------------------------------
    // Prepare order items
    // ------------------------------------------
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product as any;

      // Product exists
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart no longer exists",
        });
      }

      // Product active
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is no longer available`,
        });
      }

      // ------------------------------------------
      // Find selected size variant
      // ------------------------------------------
      const selectedVariant = product.variants?.find(
        (variant: any) =>
          variant.size?.toUpperCase() ===
          String(item.size || "")
            .trim()
            .toUpperCase()
      );

      if (!selectedVariant) {
        return res.status(400).json({
          success: false,
          message: `Selected size is not available for ${product.name}`,
        });
      }

      // ------------------------------------------
      // Check variant stock
      // ------------------------------------------
      if (Number(selectedVariant.stock) < Number(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock available for ${product.name} - ${selectedVariant.size}`,
        });
      }

      // ------------------------------------------
      // Calculate item total using variant price
      // ------------------------------------------
      const itemPrice = Number(selectedVariant.price);
      const itemTotal = itemPrice * Number(item.quantity);

      subtotal += itemTotal;

      // ------------------------------------------
      // Add item to order
      // ------------------------------------------
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: Number(item.quantity),
        size: selectedVariant.size,
        color: item.color,
        image: product.images?.[0] || "",
      });
    }

    // ------------------------------------------
    // Calculate total
    // ------------------------------------------
    const total = subtotal + deliveryFee;

    // ------------------------------------------
    // Payment status
    // ------------------------------------------
    const paymentStatus = "pending";

    // ------------------------------------------
    // Create order
    // ------------------------------------------
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      deliveryMethod,
      deliveryFee,
      paymentMethod,
      paymentStatus,
      orderStatus: "pending",
      subtotal,
      total,
    });

    // ------------------------------------------
    // Decrease selected variant stock
    // ------------------------------------------
    for (const item of cart.items) {
      const product = item.product as any;

      const selectedVariant = product.variants?.find(
        (variant: any) =>
          variant.size?.toUpperCase() ===
          String(item.size || "")
            .trim()
            .toUpperCase()
      );

      if (!selectedVariant) {
        return res.status(400).json({
          success: false,
          message: `Selected size is not available for ${product.name}`,
        });
      }

      const result = await Product.updateOne(
        {
          _id: product._id,
          variants: {
            $elemMatch: {
              size: selectedVariant.size,
              stock: { $gte: Number(item.quantity) },
            },
          },
        },
        {
          $inc: {
            "variants.$.stock": -Number(item.quantity),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(400).json({
          success: false,
          message: `Stock changed while placing the order for ${product.name} - ${selectedVariant.size}`,
        });
      }

      // ------------------------------------------
      // Socket.IO stock update
      // ------------------------------------------
      io.emit("product:variant-stock-updated", {
        productId: product._id.toString(),
        size: selectedVariant.size,
        stock:
          Number(selectedVariant.stock) -
          Number(item.quantity),
      });
    }

    // ------------------------------------------
    // Clear cart
    // ------------------------------------------
    cart.items = [];
    await cart.save();

    // ------------------------------------------
    // Populate order
    // ------------------------------------------
    const populatedOrder = await Order.findById(
      order._id
    )
      .populate("user", "name email")
      .populate("items.product");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order",
    });
  }
};

// ==========================================
// GET MY ORDERS
// ==========================================
export const getMyOrders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
};

// ==========================================
// GET SINGLE ORDER
// ==========================================
export const getOrderById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the order",
    });
  }
};

// ==========================================
// CANCEL ORDER
// ==========================================
export const cancelOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------
    // Only pending / confirmed can be cancelled
    // ------------------------------------------
    if (
      order.orderStatus !== "pending" &&
      order.orderStatus !== "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      });
    }

    // ------------------------------------------
    // Restore variant stock
    // ------------------------------------------
    for (const item of order.items) {
      if (!item.size) {
        continue;
      }

      const result = await Product.updateOne(
        {
          _id: item.product,
          "variants.size": item.size,
        },
        {
          $inc: {
            "variants.$.stock": Number(item.quantity),
          },
        }
      );

      if (result.modifiedCount > 0) {
        // Get updated product for socket event
        const updatedProduct = await Product.findById(
          item.product
        );

        const restoredVariant =
          updatedProduct?.variants?.find(
            (variant: any) =>
              variant.size.toUpperCase() ===
              item.size?.toUpperCase()
          );

        if (restoredVariant) {
          io.emit("product:variant-stock-updated", {
            productId: item.product.toString(),
            size: restoredVariant.size,
            stock: restoredVariant.stock,
          });
        }
      }
    }

    // ------------------------------------------
    // Update order status
    // ------------------------------------------
    order.orderStatus = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling the order",
    });
  }
};

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================
export const getAllOrders = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ------------------------------------------
    // Admin only
    // ------------------------------------------
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
};

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================
// ==========================================
// ADMIN - UPDATE ORDER
// ==========================================
export const updateOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ------------------------------------------
    // Admin only
    // ------------------------------------------
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;

    const {
      orderStatus,
      paymentStatus,
      deliveryMethod,
    } = req.body;

    // ------------------------------------------
    // Validate ID
    // ------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // ------------------------------------------
    // Find order
    // ------------------------------------------
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------
    // Validate order status
    // ------------------------------------------
    const allowedOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      orderStatus !== undefined &&
      !allowedOrderStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ------------------------------------------
    // Validate payment status
    // ------------------------------------------
    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
    ];

    if (
      paymentStatus !== undefined &&
      !allowedPaymentStatuses.includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // ------------------------------------------
    // Validate delivery method
    // ------------------------------------------
    const allowedDeliveryMethods = [
      "standard",
      "express",
    ];

    if (
      deliveryMethod !== undefined &&
      !allowedDeliveryMethods.includes(deliveryMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery method",
      });
    }

    // ------------------------------------------
    // Handle cancellation
    // ------------------------------------------
    const wasCancelled =
      order.orderStatus === "cancelled";

    const willBeCancelled =
      orderStatus === "cancelled";

    // ------------------------------------------
    // Restore stock only when order
    // changes to cancelled
    // ------------------------------------------
    if (!wasCancelled && willBeCancelled) {
      for (const item of order.items) {
        if (!item.size) {
          continue;
        }

        const result = await Product.updateOne(
          {
            _id: item.product,
            "variants.size": item.size,
          },
          {
            $inc: {
              "variants.$.stock": Number(
                item.quantity
              ),
            },
          }
        );

        if (result.modifiedCount > 0) {
          const updatedProduct =
            await Product.findById(item.product);

          const restoredVariant =
            updatedProduct?.variants?.find(
              (variant: any) =>
                variant.size?.toUpperCase() ===
                item.size?.toUpperCase()
            );

          if (restoredVariant) {
            io.emit(
              "product:variant-stock-updated",
              {
                productId:
                  item.product.toString(),
                size: restoredVariant.size,
                stock: restoredVariant.stock,
              }
            );
          }
        }
      }
    }

    // ------------------------------------------
    // IMPORTANT:
    // Do not restore stock again if already cancelled
    // ------------------------------------------

    // ------------------------------------------
    // Update only supplied fields
    // ------------------------------------------
    if (orderStatus !== undefined) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
    }

    if (deliveryMethod !== undefined) {
      order.deliveryMethod = deliveryMethod;

      // Update delivery fee automatically
      order.deliveryFee =
        deliveryMethod === "express"
          ? 500
          : 0;

      // Recalculate total
      order.total =
        Number(order.subtotal) +
        Number(order.deliveryFee);
    }

    await order.save();

    // ------------------------------------------
    // Populate updated order
    // ------------------------------------------
    const populatedOrder =
      await Order.findById(order._id)
        .populate("user", "name email")
        .populate(
          "items.product",
          "name images"
        );

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating order",
    });
  }
};
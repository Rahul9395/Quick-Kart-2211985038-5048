
const UserModel = require('../model/userModel');
const ProductModel = require('../model/productModel');
const { get } = require('mongoose');


const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  // console.log("Adding to cart:", { userId, productId, quantity });

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Product ID and quantity are required",
    });
  }

  try {
    // Find the user and update their cart
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the product is already in the cart
    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    if (existingItem) {
      // If it exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If it doesn't exist, add a new item
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  // console.log("Updating cart quantity:", { userId, productId, quantity });

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Product ID and quantity are required",
    });
  }

  try {
    // Find the user and update their cart
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the item in the cart and update the quantity
    const cartItem = user.cart.find(item => item.productId.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart quantity",
    });
  }
};

const getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart, 
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
    });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Remove the item from cart
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();

    // Re-fetch user with populated cart for response
    const updatedUser = await UserModel.findById(userId).populate('cart.productId');

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: updatedUser.cart,
      cartItemCount: updatedUser.cart.length,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



module.exports = {
 addToCart,
 updateCartQuantity,
 getCartItems,
 removeFromCart
}
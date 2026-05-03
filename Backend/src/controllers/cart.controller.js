import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const cart = await CartModel.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId, size, quantity = 1 } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sizes && product.sizes.length > 0 && !size) {
      return res.status(400).json({ message: "Size is required for this product" });
    }



    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId && (item.size === size || (!item.size && !size)));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = { product: productId, quantity };
      if (size) newItem.size = size;
      cart.items.push(newItem);
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }



    const item = cart.items.find(item => item.product.toString() === productId && (item.size === size || (!item.size && !size)));
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => !(item.product.toString() === productId && (item.size === size || (!item.size && !size))));
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { size } = req.body; // size should be passed in body for deletion too, or use item ID

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }



    cart.items = cart.items.filter(item => !(item.product.toString() === productId && (item.size === size || (!item.size && !size))));
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error: error.message });
  }
}


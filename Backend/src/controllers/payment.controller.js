import Razorpay from "Razorpay";
import crypto from "crypto";
import OrderModel from "../models/order.model.js";
import CartModel from "../models/cart.model.js";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const cart = await CartModel.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount in INR
    const totalAmount = cart.items.reduce((sum, item) => {
      const price = item.product.finalPrice || item.product.priceAmount || item.product.originalPrice || 0;
      return sum + (price * item.quantity);
    }, 0);

    // Create a Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order details to Database as PENDING
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.finalPrice || item.product.priceAmount || item.product.originalPrice || 0,
    }));

    const newOrder = new OrderModel({
      user: userId,
      items: orderItems,
      totalAmount,
      currency: "INR",
      paymentStatus: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating payment order", error: error.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order status
      const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = "SUCCESS";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();
      }

      // Clear the cart
      await CartModel.findOneAndUpdate({ user: userId }, { items: [] });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        orderId: order ? order._id : null
      });
    } else {
      // Payment verification failed
      const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = "FAILED";
        await order.save();
      }
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
}

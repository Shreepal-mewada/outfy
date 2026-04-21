import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(authenticate); // All cart routes require authentication

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCart);
cartRouter.put("/update", updateCartItem);
cartRouter.delete("/:productId", removeFromCart);

export default cartRouter;


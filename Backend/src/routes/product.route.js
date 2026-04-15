import express from "express";
import multer from "multer";
import { authProduct } from "../middleware/authProduct.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import { createProductValidator } from "../validatores/product.validator.js";
import { getMyProducts } from "../controllers/product.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
const router = express.Router();

router.post(
  "/",
  authProduct,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

router.get("/get-seller-products", authProduct, getMyProducts);

export default router;

import express from "express";
import multer from "multer";
import { authProduct } from "../middleware/authProduct.middleware.js";
import { 
  createProduct, getMyProducts, getAllProducts, 
  getProductById, updateProduct, deleteProduct, toggleProductStatus 
} from "../controllers/product.controller.js";
import { createProductValidator, updateProductValidator } from "../validatores/product.validator.js";

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
  upload.array("images", 10),
  createProductValidator,
  createProduct,
);

router.get("/get-seller-products", authProduct, getMyProducts);
router.get("/allproducts", getAllProducts);
router.get("/:id", getProductById); 

router.put(
  "/:id",
  authProduct,
  upload.array("images", 10),
  updateProductValidator,
  updateProduct
);

router.delete("/:id", authProduct, deleteProduct);
router.patch("/:id/toggle-active", authProduct, toggleProductStatus);

export default router;

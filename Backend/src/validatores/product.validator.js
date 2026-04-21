import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    next();
}

export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("originalPrice").isNumeric().withMessage("Original price must be a number").custom(value => value >= 0).withMessage("Price cannot be negative"),
    body("discountPercentage").optional().isNumeric().withMessage("Discount must be a number").custom(value => value >= 0 && value <= 100).withMessage("Discount must be between 0 and 100"),
    validateRequest
];

export const updateProductValidator = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("originalPrice").optional().isNumeric().custom(value => value >= 0),
    body("discountPercentage").optional().isNumeric().custom(value => value >= 0 && value <= 100),
    validateRequest
];

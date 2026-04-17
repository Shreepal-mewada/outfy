import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

// Helper to parse JSON fields safely
const parseJSONField = (field, fallback = null) => {
    try {
        return field ? JSON.parse(field) : fallback;
    } catch {
        return fallback;
    }
};

export async function createProduct(req, res) {
    try {
        const {
            title, description, brandName, category, gender,
            originalPrice, discountPercentage, currency,
            fabric, fit, pattern, sleeveType, occasion, tags,
            careInstructions, returnPolicy, deliveryInfo, isActive, isFeatured,
            variants: variantsString
        } = req.body;

        const seller = req.user;
        const images = await Promise.all((req.files || []).map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
        }));

        let parsedVariants = parseJSONField(variantsString, []);
        let parsedTags = parseJSONField(tags, []);
        let parsedOccasion = parseJSONField(occasion, []);

        if (!parsedVariants || parsedVariants.length === 0) {
            return res.status(400).json({ message: "At least one variant with color and size is required." });
        }

        const product = await ProductModel.create({
            title, description, brandName, category, gender,
            originalPrice: Number(originalPrice),
            discountPercentage: Number(discountPercentage) || 0,
            currency: currency || "INR",
            images,
            variants: parsedVariants,
            fabric, fit, pattern, sleeveType,
            occasion: parsedOccasion,
            tags: parsedTags,
            careInstructions, returnPolicy, deliveryInfo,
            isActive: isActive === 'true' || isActive === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            seller: seller._id
        });

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        
        const existingProduct = await ProductModel.findOne({ _id: id, seller: seller._id });
        if (!existingProduct) {
             return res.status(404).json({ message: "Product not found or unauthorized." });
        }

        const {
            title, description, brandName, category, gender,
            originalPrice, discountPercentage, currency,
            fabric, fit, pattern, sleeveType, occasion, tags,
            careInstructions, returnPolicy, deliveryInfo, isActive, isFeatured,
            variants: variantsString, removedImages
        } = req.body;

        let parsedVariants = parseJSONField(variantsString, existingProduct.variants);
        let parsedTags = parseJSONField(tags, existingProduct.tags);
        let parsedOccasion = parseJSONField(occasion, existingProduct.occasion);
        let parsedRemovedImages = parseJSONField(removedImages, []);

        // Filter out removed images
        let updatedImages = existingProduct.images.filter(img => !parsedRemovedImages.includes(img.url));

        // Upload only if new files provided
        if (req.files && req.files.length > 0) {
            const newImages = await Promise.all(req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                });
            }));
            updatedImages = [...updatedImages, ...newImages];
        }

        // Apply string fields directly that might be present
        if (title !== undefined) existingProduct.title = title;
        if (description !== undefined) existingProduct.description = description;
        if (brandName !== undefined) existingProduct.brandName = brandName;
        if (category !== undefined) existingProduct.category = category;
        if (gender !== undefined) existingProduct.gender = gender;
        if (originalPrice !== undefined) existingProduct.originalPrice = Number(originalPrice);
        if (discountPercentage !== undefined) existingProduct.discountPercentage = Number(discountPercentage);
        if (currency !== undefined) existingProduct.currency = currency;
        if (fabric !== undefined) existingProduct.fabric = fabric;
        if (fit !== undefined) existingProduct.fit = fit;
        if (pattern !== undefined) existingProduct.pattern = pattern;
        if (sleeveType !== undefined) existingProduct.sleeveType = sleeveType;
        if (careInstructions !== undefined) existingProduct.careInstructions = careInstructions;
        if (returnPolicy !== undefined) existingProduct.returnPolicy = returnPolicy;
        if (deliveryInfo !== undefined) existingProduct.deliveryInfo = deliveryInfo;
        
        if (isActive !== undefined) existingProduct.isActive = isActive === 'true' || isActive === true;
        if (isFeatured !== undefined) existingProduct.isFeatured = isFeatured === 'true' || isFeatured === true;

        existingProduct.variants = parsedVariants;
        existingProduct.tags = parsedTags;
        existingProduct.occasion = parsedOccasion;
        existingProduct.images = updatedImages;

        await existingProduct.save();

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product: existingProduct
        });
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const product = await ProductModel.findOneAndDelete({ _id: id, seller: seller._id });
        
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized." });
        }
        res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function toggleProductStatus(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const product = await ProductModel.findOne({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized." });
        }
        
        product.isActive = !product.isActive;
        await product.save();
        res.status(200).json({ message: "Status toggled successfully", success: true, product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) {
             return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getMyProducts(req, res) {
    try {
        const seller = req.user;
        const products = await ProductModel.find({ seller: seller._id }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
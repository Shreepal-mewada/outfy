import mongoose from 'mongoose';
import ProductModel from './src/models/product.model.js';

await mongoose.connect('mongodb+srv://OutfystoreUser:L48qLC2Szo2UqXkd@outfystore.pgbozzo.mongodb.net/OutfyStore');
const res = await ProductModel.updateMany({}, { isActive: true });
console.log('Updated products to active:', res.modifiedCount);
process.exit(0);

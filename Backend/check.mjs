import mongoose from 'mongoose';
import ProductModel from './src/models/product.model.js';

await mongoose.connect('mongodb+srv://OutfystoreUser:L48qLC2Szo2UqXkd@outfystore.pgbozzo.mongodb.net/OutfyStore');
const all = await ProductModel.find({});
console.log('Total products:', all.length);
const active = await ProductModel.find({ isActive: true });
console.log('Active products:', active.length);
process.exit(0);

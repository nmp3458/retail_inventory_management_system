import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, default: '' },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: '' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
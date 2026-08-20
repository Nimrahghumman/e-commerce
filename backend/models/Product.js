import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price must be greater than or equal to 0'],
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Associated admin who added the product
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

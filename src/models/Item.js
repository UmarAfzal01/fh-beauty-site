import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: ['Service', 'Bundle', 'Product'], 
      required: true, 
      default: 'Service' 
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' }
      }
    ],
    description: { type: String, default: '' },
    price: { type: Number },
    cutPrice: { type: Number },
    sku: { type: String, trim: true },
    options: [
      {
        name: { type: String, trim: true },
        price: { type: Number },
        cutPrice: { type: Number }
      }
    ],
    sections: { type: Array, default: [] },
    reviews: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewText: { type: String, required: true },
        name: { type: String, required: true },       
        email: { type: String, required: true },      
        image: { type: String, required: true },      
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
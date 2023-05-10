import mongoose from 'mongoose';
import User from './User';

const ItemSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    sellerUsername: {
      type: String,
      required: true,
    },
    sellerFullName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
      enum: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', 'xxs', 'XS', 'S', 'M', 'L','XL','XXL', 'XXXL'], // Add your category options here
    },
    itemLocation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['dress', 'top', 'pants' , 'skirt' , 'other'], // Add your category options here
    },
    condition: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
    },
  }, { timestamps: true });

  
  const Item = mongoose.model('Item', ItemSchema);

  export default Item;
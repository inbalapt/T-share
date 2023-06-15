import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    pictures: {
      type: [String], 
      default: [],
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
    userDescription: {
      type: String,
      //required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
      enum: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
    },
    itemLocation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['dresses', 'tops', 'pants' , 'skirts' , 'other'], // Add your category options here
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
    isBought: {
      type: Boolean,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: [String],
      default: [],
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  {timestamps:true}
);

  
const Item = mongoose.model('Item', ItemSchema);
/*
(async () => {
  try {
    // Create a new item
    const item = new Item({
      pictures:["1uczlF23Zc_wv0YHsu60jHpyAS8uzfOLq"],
      sellerUsername: 'inbal22',
      sellerFullName: 'inbal',
      description: 'dress',
      price: 30,
      size: '36',
      itemLocation: 'Haifa',
      category: 'dresses',
      condition:'good',
      color: 'pink',
      brand: 'shein',
      isBought: false
    });

    // Save the item to the database
    await item.save();
    console.log('Item saved successfully.');
  } catch (error) {
    console.error('Error saving item:', error);
  }
})();


(async () => {
  try {
    // Create a new item
    const item = new Item({

      //picturePath:photo,
      sellerUsername: 'noale',
      sellerFullName: 'Noa Leshem',
      description: 'dress',
      price: 50,
      size: '36',
      itemLocation: 'Haifa',
      category: 'dresses',
      condition:'good',
      color: 'pink',
      brand: 'shein',
      isBought: false,
      
      
    });

    // Save the item to the database
    await item.save();
    console.log('Item saved successfully.');
  } catch (error) {
    console.error('Error saving item:', error);
  }
})();
*/

export default Item;
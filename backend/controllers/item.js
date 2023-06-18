
import User from '../models/User.js';
import Item from '../models/Item.js';
import fs from "fs";
import { captureImage,runPrompt,predictImage, uploadFileToDrive } from '../utils.js';
import axios from "axios";

export const buyItem = async (req, res) => {
  try {
    const { username, sellerUsername, itemId, price } = req.body;

    const item = await Item.findOne({ _id: itemId });
    if (item.isBought) {
      return res.status(404).json({ error: 'Item is already bought' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.credit < price) {
      return res.status(400).json({ error: 'Not enough credit' });
    }

    user.credit -= parseInt(price);
    user.myBoughts.push(itemId);
    await user.save();

    const seller = await User.findOne({ username: sellerUsername });
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    seller.credit += parseInt(price);
    await seller.save();

    item.isBought = true;
    item.time = Date.now();
    await item.save();

    console.log("Item bought successfully");
    res.status(200).json({ message: 'Item bought successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const addFavoriteItem = async (req, res) => {
    try {
      const { username, id } = req.body;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const item = await Item.findOne({ _id: id });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      if (item.isBought) {
        return res.status(404).json({ error: 'Item is already bought' });
      }
  
      item.likes.push(username);
      console.log(item.likes);
      await item.save();
      // Add item id to favItems
      user.favItems.push(id);
      // Save the updated user
      await user.save();
      res.status(200).json(user.favItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};
  
export const removeFavoriteItem = async (req, res) => {
    try {
      const { username, id } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const item = await Item.findOne({ _id: id });
      item.likes = item.likes.filter((userLike) => userLike !== username);
      await item.save();
      // Remove the item from the favItems array
      user.favItems = user.favItems.filter((itemId) => itemId !== id);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Item removed from favorites' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};

export const getFavItems = (req, res) => {
    const { username } = req.query;
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        const favItemIds = user.favItems;
  
        Item.find({ _id: { $in: favItemIds }, isBought: { $ne: true } })
          .then(items => {
            res.status(200).json(items);
          })
          .catch(error => {
            console.error('Error retrieving favorite items:', error);
            res.status(500).json({ error: 'Failed to retrieve favorite items' });
          });
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
};
  
export const getItemById = (req, res) => {
    const { id } = req.query;
  
    Item.findOne({ _id: id })
      .then(item => {
        if (!item) {
          res.status(404).json({ error: 'Item not found' });
          return;
        }
  
        res.status(200).json(item);
      })
      .catch(error => {
        console.error('Error retrieving item:', error);
        res.status(500).json({ error: 'Failed to retrieve item' });
      });
};
  
export const isFavItem = (req, res) => {
    const { username, id } = req.query;
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        const itemExists = user.favItems.some((item) => item === id);
        if (itemExists) {
          res.status(200).json({ isFavorite: true });
        } else {
          res.status(200).json({ isFavorite: false });
        }
  
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
};


export const getUserItems = async (req, res) => {
    const { page, limit, userProName } = req.query;
  
    try {
      const user = await User.findOne({ username: userProName });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const itemsIds = user.myUploads;
  
      Item.find({ _id: { $in: itemsIds }, isBought: { $ne: true } })
        .then(items => {
          // Pagination logic
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const slicedItems = items.slice(startIndex, endIndex);
  
          // Assuming you have the total count of items available
          const totalCount = items.length;
          const totalPages = Math.ceil(totalCount / limit);
  
          res.status(200).json({ items: slicedItems, totalPages });
        })
        .catch(error => {
          console.error('Error retrieving favorite items:', error);
          res.status(500).json({ error: 'Failed to retrieve favorite items' });
        });
    } catch (error) {
      console.error('Error retrieving items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
export const getUploads = (req, res) => {
    const { username } = req.query;
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        const uploadsIds = user.myUploads;
  
        Item.find({ _id: { $in: uploadsIds } })
          .then(items => {
            res.status(200).json(items);
          })
          .catch(error => {
            console.error('Error retrieving favorite items:', error);
            res.status(500).json({ error: 'Failed to retrieve favorite items' });
          });
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
};
  
export const getOrders = (req, res) => {
    const { username } = req.query;
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        const boughtsIds = user.myBoughts;
  
        Item.find({ _id: { $in: boughtsIds }, isBought: { $ne: false } })
          .then(items => {
            res.status(200).json(items);
          })
          .catch(error => {
            console.error('Error retrieving favorite items:', error);
            res.status(500).json({ error: 'Failed to retrieve favorite items' });
          });
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
};
  
export const deleteItem = async (req, res) => {
    try {
      const { itemId, username } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Find the item in the Item database
      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      // Remove the item from the Item database
      await Item.deleteOne({ _id: itemId });
  
      // Remove the item ID from the user's myUploads array
      user.myUploads = user.myUploads.filter(id => id !== itemId);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};

export const autocomplete = async (req, res) => {
    try {
      const searchTerm = req.query.term; // Get the search term from the request query
      const username = req.query.username;
      const searchFields = ['sellerFullName', 'category', 'color', 'description', 'brand'];
  
      let results = [];
  
      if (searchTerm.trim() !== '') {
        const searchParts = searchTerm.split(' ').filter((part) => part !== '');
        const regexPattern = searchParts.map((part) => `(?=.*${part})`).join('');
        const searchConditions = searchFields.map((field) => ({
          [field]: { $regex: regexPattern, $options: 'i' },
        }));
  
        results = await Item.find({
          $or: searchConditions,
          sellerUsername: { $ne: username },
          isBought: { $ne: true },
        })
          .limit(20)
          .select('_id sellerUsername sellerFullName pictures description price size itemLocation category condition color brand isBought time');
      }
  
      let searchField = '';
  
      // Find the matching field based on the search term
      for (const field of searchFields) {
        if (results.some((item) => item[field].toLowerCase().includes(searchTerm.toLowerCase()))) {
          searchField = field;
          break;
        }
      }
  
      console.log(searchField);
  
      res.status(200).json({ results: results, searchField: searchField, profile: '' });
    } catch (error) {
      console.error('Error searching items:', error);
      res.status(500).json({ error: 'An error occurred while searching items' });
    }
};

export const updateItemDetails = async (req, res) => {
    try {
      // Access the updated user details
      const { username, price,description,condition,color,brand,size, id} = req.body;
  
      const images = req.files; // Get the uploaded images as an array of files
  
      // Upload each image file to Google Drive
      const uploadedImageIds = await Promise.all(images.map(uploadFileToDrive));
      // Delete the uploaded image files from the server
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
      
      const item = await Item.findById(id);
  
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      if (price) {
        item.price = price;
      }
      if (description) {
        item.description = description;
      }
      if (condition) {
        item.condition = condition;
      }
      if (color) {
        item.color = color;
      }
      if (brand) {
        item.brand = brand;
      }
      if (size) {
        item.size = size;
      }
      console.log(uploadedImageIds);
      if (uploadedImageIds.length !== 0) {
        item.pictures= uploadedImageIds; 
      }
  
  
      // Save the updated user
      await item.save();
  
      // Send a success response
      return res.status(200).json(item);
    } catch (error) {
      console.error("Error updating item details", error);
      // Send an error response
      return res.status(500).json({ error: "Internal server error" });
    }
  }

export const uploadItem = async (req, res) => {
    try {
      // Access the uploaded item data
      const { username,description, price, size, category, condition, color, brand } = req.body;
      //const images = req.files.map((file) => file.filename); // Get the filenames of the uploaded images
      const images = req.files; // Get the uploaded images as an array of files
      
      // AI description
      let AIDescription;
      if(color !== ""){
        AIDescription = await captureImage(`${images[0].path}`, category, color);
      } else{
        
        AIDescription = await captureImage(`${images[0].path}`, category, "");
      }
      
      const cleanedDescription = AIDescription.charAt(0).toUpperCase() + AIDescription.slice(1);
  
      // Upload each image file to Google Drive
      const uploadedImageIds = await Promise.all(images.map(uploadFileToDrive));
      // Delete the uploaded image files from the server
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
      
      
      const inputs = [{data: {image:{url: `https://drive.google.com/uc?export=view&id=${uploadedImageIds[0]}`}}}]
      const labelsResults = await predictImage(inputs);
      const labelsNames = labelsResults.map(label => label.name);
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      // Create a new item
      const item = new Item({
        // Item properties
        sellerUsername: username,
        sellerFullName: user.fullName,
        description: cleanedDescription,
        //userDescription: description,
        price,
        size,
        itemLocation: user.city,
        category,
        condition,
        color,
        brand,
        pictures: uploadedImageIds, 
        isBought: false,
        labels: labelsNames
      });
  
      // Save the item to the item database
      await item.save();
      console.log('Item saved successfully.');
  
    
  
      // Add the item ID to the user's myUploads array
      user.myUploads.push(item._id);
  
      // Save the updated user
      await user.save();
      
      console.log('Item added to the user\'s myUploads array.');
  
      // Send a success response
      res.status(200).json(item);
    } catch (error) {
      console.error('Error uploading item:', error);
      // Send an error response
      res.sendStatus(500); // You can use any appropriate HTTP status code
    }
  };


export const getItemsByCategory = async (req, res) => {
    const { category } = req.params;
    const { page, limit, username, sort } = req.query;
  
    try {
      let items;
      if (category === 'all') {
        items = await Item.find({ sellerUsername: { $ne: username }, isBought: { $ne: true } });
      } else {
        items = await Item.find({ category, sellerUsername: { $ne: username }, isBought: { $ne: true } });
      }
  
      if (sort === 'relevent') {
        try {
          const response = await axios.post('http://127.0.0.1:5000/recommend', { userId: username, itemType: category });
          const recommendedItemIds = response.data.ids;
  
          items = items.filter(item => recommendedItemIds.includes(item._id.toString()));
          items.sort((a, b) => recommendedItemIds.indexOf(a._id.toString()) - recommendedItemIds.indexOf(b._id.toString()));
        } catch (err) {
          console.error('Failed to retrieve recommendations:', err);
        }
      } else if (sort === 'priceLowToHigh') {
        items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === 'priceHighToLow') {
        items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const slicedItems = items.slice(startIndex, endIndex);
  
      const totalCount = items.length;
      const totalPages = Math.ceil(totalCount / limit);
  
      res.status(200).json({ items: slicedItems, totalPages });
    } catch (error) {
      console.error('Error retrieving items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
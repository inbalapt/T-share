import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import User from "./models/User.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import messageRouter from './routes/messages.js';
import Item from './models/Item.js';
import { login } from "./controllers/auth.js";
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { v4 as uuidv4 } from 'uuid';
import {google} from 'googleapis';
import fs from 'fs';
import imageHashPackage from 'image-hash';
import imageSSIM from 'image-ssim';
import sharp from 'sharp';

const drive = google.drive('v3');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
//const TOKEN_PATH = ['https://oauth2.googleapis.com/token'];
const GOOGLE_API_FOLDER_ID = '16-kMzJPiwurJ1doLa7mNjFc6hUs_c0Ig';
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/item-uploads", express.static(path.join(__dirname, "/item-uploads")));


const imageHash = imageHashPackage.hashSync;

async function resizeImage(imagePath, outputPath, width, height) {
  try {
    await sharp(imagePath).resize(width, height).toFile(outputPath);
  } catch (error) {
    throw new Error('Error resizing image: ' + error.message);
  }
}

// Function to calculate the percentage similarity between two images
async function calculateImageSimilarity(imagePath1, imagePath2) {
  try {
    // Resize the images to a lower resolution
    const resizedImagePath1 = './uploads/resizedImage1.jpg';
    const resizedImagePath2 = './uploads/resizedImage2.jpg';
    const targetWidth = 800; // Adjust the desired width
    const targetHeight = null; // Adjust the desired height, or set it to null to maintain aspect ratio

    await resizeImage(imagePath1, resizedImagePath1, targetWidth, targetHeight);
    await resizeImage(imagePath2, resizedImagePath2, targetWidth, targetHeight);

    // Read and calculate perceptual hashes for the resized images
    const image1 = await sharp(resizedImagePath1).raw().toBuffer();
    const image2 = await sharp(resizedImagePath2).raw().toBuffer();

    const hash1 = imageHash(image1, targetWidth, targetHeight, { bitDepth: 8 });
    const hash2 = imageHash(image2, targetWidth, targetHeight, { bitDepth: 8 });

    // Calculate the structural similarity index (SSIM) between the images
    const ssim = await imageSSIM.default(resizedImagePath1, resizedImagePath2);

    // Calculate the hamming distance between the hashes
    const hammingDistance = calculateHammingDistance(hash1, hash2);
    const similarityPercentage = (1 - hammingDistance / 64) * 100;

    return {
      similarityPercentage: similarityPercentage.toFixed(2),
      ssim: ssim.toFixed(4),
    };
  } catch (error) {
    throw new Error('Error calculating image similarity: ' + error.message);
  }
}

// Function to calculate the hamming distance between two hashes
function calculateHammingDistance(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}
 // Example usage
 const imagePath1 = './uploads/1685688029704.jpg';
 const imagePath2 = './uploads/1685688029704.jpg';
 
/*
calculateImageSimilarity(imagePath1, imagePath2)
  .then((result) => {
    console.log('Similarity Percentage:', result.similarityPercentage + '%');
    console.log('SSIM:', result.ssim);
  })
  .catch((error) => {
    console.error(error);
  });
*/
 

// Multer configuration
/*const storage = multer.memoryStorage(); // Use memory storage for temporary file storage
const upload = multer({ storage });*/
const MongoDBStore = connectMongoDBSession(session);

// Function to upload a file to Google Drive
async function uploadFileToDrive(file) {

  try{
    const auth = new google.auth.GoogleAuth({
      keyFile: './googlekey.json',
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })

    const driveService = google.drive({
      version: 'v3',
      auth
    })
  
    const fileMetadata = {
      name: file.originalname,
      parents: [GOOGLE_API_FOLDER_ID]
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path)
    };
  
    const response = await driveService.files.create({
      auth,
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log(response.data.id);
    return response.data.id;
  
  } catch(err) {
    console.log('Upload file error', err);
  }
}


const credentialsFilePath = path.join(__dirname, 'googlekey.json');
// Function to get the Google Drive API authentication client
async function getAuthClient() {
  const credentialsData = fs.readFileSync(credentialsFilePath, 'utf8');
  const credentials = JSON.parse(credentialsData);

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  let token;
  try {
    token = require('./token.json'); // Replace with the path to your token JSON file
    oAuth2Client.setCredentials(token);
  } catch (error) {
    token = await getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

// Function to get the access token for the Google Drive API
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const code = await askForAuthorizationCode(); // Implement a method to get the authorization code from the user

  const { tokens } = await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials(tokens);

  // Save the access token for future use
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

  console.log('Token stored in', TOKEN_PATH);

  return tokens;
}

/* FILE STORAGE */
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the destination folder to save the uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`; // Append original file name as a unique identifier
    cb(null, uniqueFilename); // Set a unique filename for the uploaded image
  },
});
const upload = multer({ storage });


app.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    // Process the uploaded image or perform necessary operations
    // Access the uploaded file via `req.file`
    console.log("req file is: " + req.file);
    console.log("req file filename is: " +req.file.filename);
    const { myUsername, friendUsername, time} = req.query;
    // Upload the file to Google Drive
    const fileId = await uploadFileToDrive(req.file);
    // Delete the image file from the uploads directory
    fs.unlinkSync(req.file.path);
    // Find the user and friend documents from the database
    const [user, friend] = await Promise.all([
      User.findOne({ username: myUsername }),
      User.findOne({ username: friendUsername }),
    ]);

    // Check if both user and friend exist
    if (user && friend) {
      // Generate a unique ID for the image (you can use a library like `uuid` for this)
      const imageId = uuidv4();
      
      // Check if the friendUsername is already in the user's friends array
      const friendExists = user.friends.some((friend1) => friend1.username === friendUsername);

      if (!friendExists) {
        const newFriend = {username:friendUsername, messages:[{
          sender: true, // Message sent by the user
          msgType: "image",
          content: fileId,
          createdAt: time
        }]};
        user.friends.push(newFriend);

        // Save the updated user data
        await user.save();

        const newUserFriend = {username:user.username, messages:[{
          sender: false, // Message sent by the user
          msgType: "image",
          content: fileId,
          createdAt: time
        }]};
        friend.friends.push(newUserFriend);

        // Save the updated user data
        await user.save();

      } else{
         
        // Update the user's messages
        user.friends.forEach((friendItem) => {
          if (friendItem.username === friend.username) {
            friendItem.messages.push({
              sender: true,
              msgType: "image",
              content: fileId,
              createdAt: time,
            });
          }
        });

        // Update the friend's messages
        friend.friends.forEach((friendItem) => {
          if (friendItem.username === user.username) {
            friendItem.messages.push({
              sender: false,
              msgType: "image",
              content: fileId,
              createdAt: time,
            });
          }
        });

        // Save the updated user and friend to the database
        await Promise.all([user.save(), friend.save()]);
      }
    
      
      res.json(fileId);
    } else {
      res.status(404).json({ message: "User or friend not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});



app.post("/uploadVideo", upload.single("video"), async (req, res) => {
  try {
    // Process the uploaded video or perform necessary operations
    // Access the uploaded file via `req.file`
    console.log("req file is: " + req.file);
    console.log("req file filename is: " + req.file.filename);
    const { myUsername, friendUsername, time } = req.query;
    // Upload the file to Google Drive
    const fileId = await uploadFileToDrive(req.file);
    fs.unlinkSync(req.file.path);
    // Find the user and friend documents from the database
    const [user, friend] = await Promise.all([
      User.findOne({ username: myUsername }),
      User.findOne({ username: friendUsername }),
    ]);

    // Check if both user and friend exist
    if (user && friend) {
      // Generate a unique ID for the video (you can use a library like `uuid` for this)
      const videoId = uuidv4();

       // Check if the friendUsername is already in the user's friends array
       const friendExists = user.friends.some((friend1) => friend1.username === friendUsername);

       if (!friendExists) {
          const newFriend = {username:friendUsername, messages:[{
            sender: true,
            msgType: "video",
            content: fileId,
            createdAt: time
          }]};
          user.friends.push(newFriend);
  
          // Save the updated user data
          await user.save();
  
          const newUserFriend = {username:user.username, messages:[{
            sender: false, // Message sent by the user
            msgType: "video",
            content: fileId,
            createdAt: time
          }]};
          friend.friends.push(newUserFriend);
  
          // Save the updated user data
          await user.save();
  
        } else{
        // Update the user's messages
        user.friends.forEach((friendItem) => {
          if (friendItem.username === friend.username) {
            friendItem.messages.push({
              sender: true,
              msgType: "video",
              content: fileId,
              createdAt: time,
            });
          }
        });

        // Update the friend's messages
        friend.friends.forEach((friendItem) => {
          if (friendItem.username === user.username) {
            friendItem.messages.push({
              sender: false,
              msgType: "video",
              content: fileId,
              createdAt: time,
            });
          }
        });

        // Save the updated user and friend to the database
        await Promise.all([user.save(), friend.save()]);
      }
     

      res.json(fileId);
    } else {
      res.status(404).json({ message: "User or friend not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading video" });
  }
});


const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "item-uploads/"); // Specify the destination folder to save the uploaded item images/videos
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`; // Append original file name as a unique identifier
    cb(null, uniqueFilename); // Set a unique filename for the uploaded image/video
  },
});

const itemUpload = multer({ storage: itemStorage });

// Endpoint for uploading item images
app.post("/uploadItem", itemUpload.array("images", 4), async (req, res) => {
  try {
    // Access the uploaded item data
    const { username,description, price, size, category, condition, color, brand } = req.body;
    //const images = req.files.map((file) => file.filename); // Get the filenames of the uploaded images
    const images = req.files; // Get the uploaded images as an array of files

    // Upload each image file to Google Drive
    const uploadedImageIds = await Promise.all(images.map(uploadFileToDrive));
    // Delete the uploaded image files from the server
    images.forEach((image) => {
      fs.unlinkSync(image.path);
    });
    
    console.log("uploaded: ");
    console.log(uploadedImageIds)
    // Find the user by username
    const user = await User.findOne({ username });

    // Create a new item
    const item = new Item({
      // Item properties
      sellerUsername: username,
      sellerFullName: user.fullName,
      description,
      price,
      size,
      itemLocation: 'Haifa',
      category,
      condition,
      color,
      brand,
      pictures: uploadedImageIds, 
      isBought: false
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
    res.json(item);
  } catch (error) {
    console.error('Error uploading item:', error);
    // Send an error response
    res.sendStatus(500); // You can use any appropriate HTTP status code
  }
});


/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);

/* ROUTES */
app.use("/auth", authRouter);
app.use('/', messageRouter);
//app.use("/users", userRouter);
// Configure session middleware
const store = new MongoDBStore({
  uri: process.env.MONGO_URL, // MongoDB connection URI
  collection: 'sessions', // Collection name to store the sessions
});

store.on('error', (error) => {
  console.error('MongoDB session store error:', error);
});

app.use(session({
  secret: 'hardstringtoguess',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

app.use((req, res, next) => {
  //console.log(req.session.username); // Check the value here
  req.username = req.session.username;
  next();
});

app.post('/buyItem', async (req, res) => {
  try {
    const { username, sellerUsername, itemId, price } = req.query;

    const item = await Item.findOne({ _id: itemId });
    if (item.isBought) {
      return res.status(204).json({ error: 'Item is already bought' });
    }

    // Decrease user's credit
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

    // Increase seller's credit
    const seller = await User.findOne({ username: sellerUsername });
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
});


app.post("/updateUserDetails", upload.single("image"), async (req, res) => {
  try {
    // Access the updated user details
    const { username, city, height, weight, credit, email } = req.body;

     // Upload image file to Google Drive
     const fileId = await uploadFileToDrive(req.file);
     console.log("uploaded: ");
     console.log(fileId)
    

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (city) {
      user.city = city;
    }
    if (!isNaN(height)) {
      user.height = height;
    }
    if (!isNaN(weight)) {
      user.weight = weight;
    }
    if (email) {
      user.email = email;
    }
    if (fileId != undefined) {
      user.picturePath = fileId;
    }


    // Save the updated user
    await user.save();
    console.log("User details updated");

    // Send a success response
    return res.json(user);
  } catch (error) {
    console.error("Error updating user details", error);
    // Send an error response
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/addFavoriteItem', async(req,res) =>{
  try {
    const { username, id } = req.query;
   
    const user = await User.findOne({ username });
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const item = Item.findOne({_id: id});
    if(item.isBought){
      return res.status(204).json({ error: 'Item is already bought' });
    }
    // Add item id to favItems
    user.favItems.push(id);
    // Save the updated user
    await user.save();
    console.log(user.favItems);
    res.json(user.favItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/removeFavoriteItem', async (req, res) => {
  try {
    const { username, id } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the item from the favItems array
    user.favItems = user.favItems.filter(itemId => itemId !== id);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/getFavItems', (req, res) => {
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
          res.json(items);
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
});


app.get('/getItemById', (req, res) => {
  const { id } = req.query;

  Item.findOne({ _id: id })
    .then(item => {
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      if(item.isBought){
        res.status(204).json({ error: 'Item is bought' });
        return;
      }
      res.json(item);
    })
    .catch(error => {
      console.error('Error retrieving item:', error);
      res.status(500).json({ error: 'Failed to retrieve item' });
    });
});

app.get('/isFavItem', (req,res) => {
  const { username, id } = req.query;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const itemExists = user.favItems.some((item) => item === id);
      if(itemExists){
        res.json({  isFavorite: true});
      } else{
        res.json({ isFavorite:false});
      }
     
    })
    .catch(error => {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});


app.post('/addNewFriend', async(req,res) =>{
  try {
    const { username, friendUsername, content, type, createdAt } = req.query;
    // Find the user in the database
    // add to user's friend list, the friend user
    
    const user = await User.findOne({ username });
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

     // Check if the friendUsername is already in the user's friends array
     const friendExists = user.friends.some((friend) => friend.username === friendUsername);

     if (friendExists) {
       return res.status(400).json({ error: 'Friend already in friends list' });
     }

    const newFriend = {username:friendUsername, messages:[{
      sender: true, // Message sent by the user
      msgType: type,
      content: content,
      createdAt: createdAt
    }]};
    user.friends.push(newFriend);

    // Save the updated user data
    await user.save();

    // add to friend's friend list, the current user
    const friendUser = await User.findOne({ username:friendUsername });
    if (!friendUser) {
      console.log("friend not found");
      return res.status(404).json({ error: 'User not found' });
    }

     // Check if the friendUsername is already in the user's friends array
     const userExists = friendUser.friends.some((friend) => friend.username === username);

     if (userExists) {
       return res.status(400).json({ error: 'Friend already in friends list' });
     }

    const newUserFriend = {username:username, messages:[{
      sender: false, // Message sent by the user
      msgType: type,
      content: content,
      createdAt: createdAt}]};
    friendUser.friends.push(newUserFriend);
     // Save the updated user data
    await friendUser.save();

    res.json({ success: true, message: 'Friend added successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Retrieve items by category
app.get('/items/:category', async (req, res) => {
  const category = req.params.category;
  const { username } = req.query;  
  try {
    let items;
    if (category === 'all') {
      // Retrieve all items from the database
      items = await Item.find({sellerUsername: { $ne: username }, isBought: { $ne: true }});
    } else {
      // Retrieve items based on the specified category
      items = await Item.find({ category, sellerUsername: { $ne: username }, isBought: { $ne: true } });
    }
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getUserDetails', async (req,res)=>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ city: user.city,
    height: user.height,
    weight: user.weight,
    credit: user.credit,
    email: user.email,
    image: user.picturePath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/getFriends', async (req, res) => {
  try {
      const { username } = req.query;
      const user = await User.findOne({ username });
      res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get("/getFullname", async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ fullName: user.fullName });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


app.get("/getProfile", async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ image: user.picturePath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


app.get("/getUploads", async(req,res)=>{
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
          res.json(items);
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
});


app.get("/getOrders", async (req,res) =>{
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
          res.json(items);
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
});

app.get("/getCredit", async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ credit:user.credit });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get("/getID", async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.delete('/deleteItem', async (req, res) => {
  try {
    const {  itemId, username } = req.query;

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
});


// check if username is taken in registeration
app.get("/auth/checkUsername", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// check if username is taken in registeration
app.get("/auth/checkEmail", async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});



const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

import http from "http";
import { Server } from "socket.io";
import { env } from "process";


const server = http.createServer(app);
server.listen(3000, () => console.log(`listening at ${PORT}`));
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket) => {
  console.log('connected to socket.io');

  socket.on("setup", (userData)=>{
    socket.join(userData);
    
    socket.emit("connected");
  });

  socket.on("join room", (userId) => {
    console.log("join " + userId)
    socket.join(userId); // Join the user to their own room
  });
  
  socket.on("send message", (friendID, newMessage, user, flag) =>{
    console.log("friend is " +friendID);
    socket.in(friendID).emit("message recieved", newMessage, user, flag);
    socket.emit("message recieved", newMessage, user, flag);
  })

});


// Endpoint for autocomplete search
app.get('/autocomplete', async (req, res) => {
  try {
    const searchTerm = req.query.term; // Get the search term from the request query
    const username = req.query.username;
    // Perform the search query using the Item model
    const results = await Item.find({
      $or: [
        { category: { $regex: searchTerm, $options: 'i' } },
        { color: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
      ],
      sellerUsername: { $ne: username },
    })
      .limit(10) // Limit the number of results to 10
      .select('_id sellerUsername sellerFullName pictures description price size itemLocation category condition color brand isBought time')

    res.json(results);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'An error occurred while searching items' });
  }
});

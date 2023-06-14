import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path, { resolve } from "path";
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
import vision from '@google-cloud/vision';
import nlp from 'compromise';
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

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


const config = new Configuration({
	apiKey: `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`,
});

const openai = new OpenAIApi(config);
const runPrompt = async (description, color) => {
  console.log(description, color);
	const prompt = `
    please answer only with the updated description. without additions!! 
    i will give you description of AI about a cloth, and color that i (truth telling) write about the cloth. if there is a contradiction between the color in the description to the color that i wrote, please fix it according to the color that i wrote.  if the color doesn't appear in the description, add it!
    description: blue dress
    color: white
    for this the updated description (and what i want you to reply), will be exactly this: white dress
    if there is not a contradiction, return me the description. 
    description: ${description}
    color: ${color}
    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const chatUpdatedDescription = response.data.choices[0].text;
  let updated = chatUpdatedDescription;
  if(updated.includes(":")){
    updated = updated.split(":")[1].trim();
  }
  if (updated.endsWith(".")) {
    updated = updated.slice(0, -1);
  }
  
  return updated;
  
};
/*const description1="floral skirt"
const color1="green";
const description2="white dress"
const color2="purple";
const description3="white dress with paints"
const color3="purple";
runPrompt(description1,color1).then(
runPrompt(description2,color2)).then(
runPrompt(description3,color3));*/

/* Clarifai labels for image */
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 75f1751d1d244811b2b9d3b4d239de76");

function predictImage(inputs){
  return new Promise((resolve, reject) =>{
    stub.PostModelOutputs(
      {
          // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
          model_id: "aaa03c23b3724a16a56b629203edc62c",
          inputs: inputs
      },
      metadata,
      (err, response) => {
          if (err) {
              reject("Error: " + err);
              return;
          }
  
          if (response.status.code !== 10000) {
              console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
              return;
          }
          let results = [];
          for (const c of response.outputs[0].data.concepts) {
              const ignoreLabels = ["no person", "fashion", "wear", "cutout", "one","winter", "isolated", "model", "architecture", "wood", "indoors","people","portrait", "facial expression", "adult", "girl", "kitchenware", "happiness", "room", "creativity", "child", "looking", "brunette", "enjoyment", "cooking", "family", "person", "illustration", "desktop","vector"]
              if(!ignoreLabels.includes(c.name) && c.value >= 0.9){
                //console.log(c.name + ": " + c.value);
                results.push({
                  name: c.name,
                  value: c.value
                })
              }
          }
          resolve(results);
      }
  );
  })
}

// Replace with your own endpoint and access key
const endpoint = "https://visioninbalnoa.cognitiveservices.azure.com/";
const accessKey = "d5f5ec9903af476bb0fa2a05baf1ecde";

const credentials = new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": accessKey } });
const client = new ComputerVisionClient(credentials, endpoint);

// Function to capture an image
async function captureImage(imageFile, category, color) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imageFile);

    // Perform the image analysis using ComputerVisionClient
    const result = await client.analyzeImageInStream(imageBuffer, { visualFeatures: ["Tags", "Description"] });

    // Process the result
    /*console.log("Tags:");
    result.tags.forEach((tag) => console.log(tag.name));*/
    console.log("Description:");
    //result.description.forEach((caption) => console.log(caption.text));
    console.log(result.description.captions[0].text);
    ///////////////////////////// description
    
    const description = result.description.captions[0].text;

    // Find the index of the phrase "on a"
    const onAIndex = description.indexOf("on a");

    let cleanedDescription;

    if (onAIndex !== -1) {
      // Remove the portion of the sentence after "on a" using substring
      cleanedDescription = description.substring(0, onAIndex).trim();
    } else {
      const fromAIndex = description.indexOf("from a");
      if(fromAIndex !== -1){
        // Remove the portion of the sentence after "on a" using substring
        cleanedDescription = description.substring(0, fromAIndex).trim();
      }
      else{
        // Keep the entire sentence
        cleanedDescription = description;
      }
    }

    let modifiedDescription = cleanedDescription;
    if (cleanedDescription.startsWith("a close-up of a ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 15);
    }
    else if (cleanedDescription.startsWith("a stack of ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 10);
    }
    else if(cleanedDescription.startsWith("a woman's hand holding a ")){
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 24);
    }
    else if(cleanedDescription.startsWith("a group of ")){
      console.log("here!");
      modifiedDescription = cleanedDescription.split("of ")[1].trim();
    }
    else if (cleanedDescription.startsWith("a ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 1);
    }
    
    if (modifiedDescription.startsWith("pair of ") && category == "skirts") {
      const searchPattern = "pair of";
      const replacement = "skirt";

      modifiedDescription = modifiedDescription.replace(searchPattern, "").trim() + " " + replacement;
      console.log(modifiedDescription);
    }

   

    console.log("cleaned : " +modifiedDescription);

    let itemCategory;
    if (category == "dresses"){
      itemCategory = "dress";
    }
    if (category == "tops"){
      itemCategory = "top";
    }
    if (category == "skirts"){
      itemCategory = "skirt";
    }
    if (category == "pants"){
      itemCategory = "pants";
    }

    const wordList = ["hat","book", "pillow", "rectangle", "garment", "cloth", "dress", "shirt", "pants","diapers","diaper","ball","flag", "bracelet", "necklace", "tie", "towels","towel", "purse", "cylindrical", "object","bag", "underwear", "puzzle", "piece", "toilet", "paper", "roll", "candy", "bars"];

    let numberOfWords = 0;
    let cutSentence = false;
    const updatedSentence = modifiedDescription
      .split(" ")
      .map((word) => {
        if (cutSentence) {
          return "";
        }
    
        if (wordList.includes(word.toLowerCase())) {
          if ((category == "top" && (word == "shirt" || word == "t-shirt")) || (category == "pants" && word == "shorts")) {
            return word;
          }
          if(word == "piece"){
            cutSentence = true;
            return itemCategory;
          }
    
          numberOfWords = numberOfWords + 1;
          if (numberOfWords === 1) {
            return itemCategory;
          } else if (numberOfWords === 2) {
            cutSentence = true;
            return "";
          }
        }
        return word;
      })
      .join(" ");

    const pattern1 = `with a white background`;
    const pattern2 = `with a strap`;
    const pattern3 = `over her head`;

    const veryUpdatedSentence = updatedSentence.replace(pattern1, "").replace(pattern2, "").replace(pattern3, "");
    var finalDesctiption = veryUpdatedSentence;
    if(color !== ""){
      finalDesctiption = await runPrompt(veryUpdatedSentence, color);
    }
    
    console.log("final : " + finalDesctiption);

    return finalDesctiption;
  } catch (error) {
    console.error("An error occurred during image capture:", error);
  }
}



async function quickstart() {

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './vision-tshare.json',
  });

  // Performs label detection on the image file
  const [result] = await client.labelDetection('./uploads/1685688029704.jpg');
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => {
    console.log(label.description)
    console.log(label.score)});
}
//quickstart();


// Multer configuration
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
          createdAt: time,
        }]};
        friend.hasUnreadMessages = true;
        friend.friends.push(newUserFriend);

        // Save the updated friend data
        await friend.save();
        
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
        friend.hasUnreadMessages = true;
        // Save the updated user and friend to the database
        await Promise.all([user.save(), friend.save()]);
        console.log(friend.username + friend.hasUnreadMessages);
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
            createdAt: time,
          }]};
          friend.friends.push(newUserFriend);
          friend.hasUnreadMessages = true;
          // Save the updated user data
          await friend.save();
  
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
        friend.hasUnreadMessages = true;
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
    
    // AI description
    const AIDescription = await captureImage(`${images[0].path}`, category, color);
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
    console.log(labelsNames);

    // Find the user by username
    const user = await User.findOne({ username });

    // Create a new item
    const item = new Item({
      // Item properties
      sellerUsername: username,
      sellerFullName: user.fullName,
      description: cleanedDescription,
      userDescription: description,
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
    res.json(item);
  } catch (error) {
    console.error('Error uploading item:', error);
    // Send an error response
    res.sendStatus(500); // You can use any appropriate HTTP status code
  }
});



// Endpoint for uploading item images
app.post("/followUser", async (req, res) => {
  try {
    const { username, userProName } = req.body;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      // Handle the case when the user is not found
      // For example, return an error response
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToFollow = await User.findOne({ username:userProName});
    if(!userToFollow){
      console.log("userToFollow not found");
    }
    user.following.push(userProName);
    // Save the updated user
    await user.save();

    // update followers
    userToFollow.followers.push(username);
    await userToFollow.save();
    
    console.log('User added to following array.');
    res.json(200);
  } catch (error) {
    console.error('Error following user:', error);
    // Send an error response
    res.sendStatus(500); 
  }
});



// Endpoint for uploading item images
app.delete("/unfollowUser", async (req, res) => {
  try {
    const { username, userProName } = req.body;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      // Handle the case when the user is not found
      // For example, return an error response
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToFollow = await User.findOne({ username:userProName});
    if(!userToFollow){
      console.log("userToFollow not found");
    }
    if(user.following.includes(userProName)){
      user.following = user.following.filter((item) => item !== userProName);
    }
    // Save the updated user
    await user.save();

    // update followers.
    userToFollow.followers = userToFollow.followers.filter((followerUsername) => followerUsername !== username)
    await userToFollow.save();

    console.log('User removed from following array.');
    res.json(200);
  } catch (error) {
    console.error('Error following user:', error);
    // Send an error response
    res.sendStatus(500); 
  }
});


app.get("/checkIfFollowed", async(req,res)=>{
  try {
    const { username, userProName } = req.query;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      // Handle the case when the user is not found
      // For example, return an error response
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToFollow = await User.find({ username:userProName});
    if(!userToFollow){
      console.log("userToFollow not found");
    }

    if(user.following.includes(userProName)){
      return res.json({followed: true});
    }
    else {
      return res.json({followed: false});
    }
    res.json(200);
  } catch (error) {
    console.error('Error following user:', error);
    // Send an error response
    res.sendStatus(500); 
  }
});

/* ROUTES WITH FILES */
app.post("/auth/register", register);

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
      return res.status(404).json({ error: 'Item is already bought' });
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



app.post("/changeNotUnreadMessages", async (req,res)=>{
  const { username } = req.query;
  try{
    // Find the user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.hasUnreadMessages = false;
    await user.save();
    // Send a success response
    return res.status(200);
  } catch (error) {
    console.error("Error updating user details", error);
    // Send an error response
    return res.status(500).json({ error: "Internal server error" });
  }
})

app.post("/updateItemDetails", itemUpload.array("images", 4), async (req, res) => {
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
    return res.json(item);
  } catch (error) {
    console.error("Error updating item details", error);
    // Send an error response
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/updateUserDetails", upload.single("image"), async (req, res) => {
  try {
    // Access the updated user details
    const { username, city, size, credit, email } = req.body;

     // Upload image file to Google Drive
     const fileId = await uploadFileToDrive(req.file);
    

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (city) {
      user.city = city;
    }
    if (!isNaN(size)) {
      user.size = size;
    }
    if (email) {
      user.email = email;
    }
    if (fileId != undefined) {
      user.picturePath = fileId;
    }

    if(city){
      console.log("HIII");
      const userItems = user.myUploads;

      await Item.updateMany(
        { _id: { $in: userItems } },
        { $set: { itemLocation: city } }
      );
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
    const item = await Item.findOne({_id: id});
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if(item.isBought){
      return res.status(404).json({ error: 'Item is already bought' });
    }
   
    item.likes.push(username);
    console.log(item.likes);
    await item.save();
    // Add item id to favItems
    user.favItems.push(id);
    // Save the updated user
    await user.save();
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
    const item = await Item.findOne({_id: id});
    item.likes = item.likes.filter(userLike => userLike !== username);
    await item.save();
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

app.get('/hasUnreadMessages', (req, res)=> {
  const { username } = req.query;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      return res.status(200).json({ has: user.hasUnreadMessages });
    })
    .catch(error => {
      res.status(500).json({ error: 'User has no this field.' });
    });
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
     /* if(item.isBought){
        res.status(204).json({ error: 'Item is bought' });
        return;
      }*/
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
    friendUser.hasUnreadMessages = true;

     // Check if the friendUsername is already in the user's friends array
     const userExists = friendUser.friends.some((friend) => friend.username === username);

     if (userExists) {
       return res.status(400).json({ error: 'Friend already in friends list' });
     }

    const newUserFriend = {username:username, messages:[{
      sender: false, // Message sent by the user
      msgType: type,
      content: content,
      createdAt: createdAt,
    }]};
    friendUser.friends.push(newUserFriend);
     // Save the updated user data
    friendUser.hasUnreadMessages = true;
    
    await friendUser.save();
    
    res.json({ success: true, message: 'Friend added successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


/*
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
});*/

app.get('/items/:category', async (req, res) => {
  const { category } = req.params;
  const { page, limit,username } = req.query;
  
  try {
    let items;
    if (category === 'all') {
      
      // Retrieve all items from the database
      items = await Item.find({ sellerUsername: { $ne: username }, isBought: { $ne: true } });
    } else {
      // Retrieve items based on the specified category
      items = await Item.find({ category, sellerUsername: { $ne: username }, isBought: { $ne: true } });
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const slicedItems = items.slice(startIndex, endIndex);

    // Assuming you have the total count of items available
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ items: slicedItems, totalPages });
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUserItems', async (req, res) => {
 
  const { page, limit, userProName } = req.query;
  
  
  try {

    const user = await User.findOne({username:userProName});
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

          res.json({ items: slicedItems, totalPages });    
      })
      .catch(error => {
        console.error('Error retrieving favorite items:', error);
        res.status(500).json({ error: 'Failed to retrieve favorite items' });
      });


 
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
    size: user.size,
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
import { cloudidentity } from "googleapis/build/src/apis/cloudidentity/index.js";



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
/*app.get('/autocomplete', async (req, res) => {
  try {
    const searchTerm = req.query.term; // Get the search term from the request query
    const username = req.query.username;
    const searchFields = ['sellerFullName', 'category', 'color', 'description', 'brand'];
    const searchConditions = searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
    
    const results = await Item.find({
      $or: searchConditions,
      sellerUsername: { $ne: username },
      isBought: {$ne:true}
    })
      .limit(20)
      .select('_id sellerUsername sellerFullName pictures description price size itemLocation category condition color brand isBought time');
    
    let searchField = '';
    
    // Find the matching field based on the search term
    for (const field of searchFields) {
      if (results.some((item) => item[field].toLowerCase().includes(searchTerm.toLowerCase()))) {
        searchField = field;
        break;
      }
    }
    /*if(searchField == "sellerFullName"){
      const user = await User.findOne({ username: results[0].sellerUsername });
      const photo = user.picturePath;
      console.log("photo : "+photo);
      return res.json({results: results, searchField: searchField, profile: photo});
    }*/
    /*console.log(searchField);

    res.json({results: results, searchField:searchField, profile: ""});
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'An error occurred while searching items' });
  }
});
*/
app.get('/autocomplete', async (req, res) => {
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

    res.json({ results: results, searchField: searchField, profile: '' });
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'An error occurred while searching items' });
  }
});

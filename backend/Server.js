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



const MongoDBStore = connectMongoDBSession(session);


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
          content: req.file.filename,
          createdAt: time
        }]};
        user.friends.push(newFriend);

        // Save the updated user data
        await user.save();

        const newUserFriend = {username:user.username, messages:[{
          sender: false, // Message sent by the user
          msgType: "image",
          content: req.file.filename,
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
              content: req.file.filename,
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
              content: req.file.filename,
              createdAt: time,
            });
          }
        });

        // Save the updated user and friend to the database
        await Promise.all([user.save(), friend.save()]);
      }
    
      res.json(req.file.filename);
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
            content: req.file.filename,
            createdAt: time
          }]};
          user.friends.push(newFriend);
  
          // Save the updated user data
          await user.save();
  
          const newUserFriend = {username:user.username, messages:[{
            sender: false, // Message sent by the user
            msgType: "video",
            content: req.file.filename,
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
              content: req.file.filename,
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
              content: req.file.filename,
              createdAt: time,
            });
          }
        });

        // Save the updated user and friend to the database
        await Promise.all([user.save(), friend.save()]);
      }

      res.json(req.file.filename);
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
    const images = req.files.map((file) => file.filename); // Get the filenames of the uploaded images

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
      pictures: images, // Assign the filenames to the item's pictures property
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


app.post('/addFavoriteItem', async(req,res) =>{
  try {
    const { username, id } = req.query;
   
    const user = await User.findOne({ username });
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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

      Item.find({ _id: { $in: favItemIds } })
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
      items = await Item.find();
    } else {
      // Retrieve items based on the specified category
      items = await Item.find({ category, sellerUsername: { $ne: username } });
    }
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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




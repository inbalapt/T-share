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
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import itemRouter from "./routes/item.js";
import messageRouter from './routes/messages.js';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';


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
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

/* ROUTES */
app.use("/auth", authRouter);
app.use("/", messageRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);

// Multer configuration
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

const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

import http from "http";
import { Server } from "socket.io";



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

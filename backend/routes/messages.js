// Assuming you're using Express.js
import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import multer from 'multer';
import { getMessages, postMessage, changeNotUnreadMessages, addNewFriend, hasUnreadMessages, uploadImage, uploadVideo } from '../controllers/messages.js';


const upload = multer({ dest: 'uploads/' });


router.post("/uploadImage", upload.single("image"), uploadImage);
router.post("/uploadVideo", upload.single("video"), uploadVideo);

/* Get messages of two contacts */ 
router.get('/getMessages', getMessages);

/* Post a message in chat of contacts */
router.post('/messages',postMessage);
router.post('/changeNotUnreadMessages', changeNotUnreadMessages);
router.post('/addNewFriend', addNewFriend);
router.get('/hasUnreadMessages', hasUnreadMessages);


export default router;

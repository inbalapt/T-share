import express from "express";
import User from '../models/User.js';
import multer from 'multer';
import {getUserDetails, getFriends, getFullname, getProfile, getCredit, getID, followUser, unfollowUser, checkIfFollowed, updateUserDetails} from "../controllers/user.js"
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Route for updating user details
router.post("/updateUserDetails", upload.single('image'), updateUserDetails);
router.get("/getUserDetails",getUserDetails);
router.get("/getFriends",getFriends);
router.get("/getFullname", getFullname);
router.get("/getProfile", getProfile);
router.get("/getCredit", getCredit);
router.get("/getID", getID);
router.post("/followUser", followUser);
router.delete("/unfollowUser", unfollowUser);
router.get("/checkIfFollowed", checkIfFollowed);

export default router;


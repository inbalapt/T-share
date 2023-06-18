import User from "../models/User.js";
import Item from "../models/Item.js";
import fs from "fs";
import { uploadFileToDrive } from '../utils.js';
import { resolveSoa } from "dns";


export const getUserDetails =  async (req, res) => {
    try {
      const { username } = req.query;
      const user = await User.findOne({ username });
      res.status(200).json({
        city: user.city,
        size: user.size,
        credit: user.credit,
        email: user.email,
        image: user.picturePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
};



export const getFriends = async (req, res) => {
    try {
      const { username } = req.query;
      const user = await User.findOne({ username });
      res.status(200).json({ friends: user.friends });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
};


export const getFullname = async (req, res) => {
    try {
      const { username } = req.query;
      const user = await User.findOne({ username });
      res.status(200).json({ fullName: user.fullName });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
};


export const getProfile = async (req, res) => {
    try {
      const { username } = req.query;
      const user = await User.findOne({ username });
      res.status(200).json({ image: user.picturePath });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  
};


export const getCredit = async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ credit:user.credit });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
};


export const getID = async (req,res) =>{
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


export const followUser = async (req, res) => {
  try {
    const { username, userProName } = req.body;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToFollow = await User.findOne({ username: userProName });
    if (!userToFollow) {
      console.log("User to follow not found");
      res.status(404).json({ error: "User to follow not found" });
      return;
    }

    user.following.push(userProName);
    await user.save();

    userToFollow.followers.push(username);
    await userToFollow.save();
    
    console.log('User added to following array.');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error following user:', error);
    res.sendStatus(500); 
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { username, userProName } = req.body;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToUnfollow = await User.findOne({ username: userProName });
    if (!userToUnfollow) {
      console.log("User to unfollow not found");
      res.status(404).json({ error: "User to unfollow not found" });
      return;
    }

    user.following = user.following.filter((item) => item !== userProName);
    await user.save();

    userToUnfollow.followers = userToUnfollow.followers.filter((followerUsername) => followerUsername !== username);
    await userToUnfollow.save();

    console.log('User removed from following array.');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.sendStatus(500); 
  }
};

export const checkIfFollowed = async (req, res) => {
  try {
    const { username, userProName } = req.query;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const userToCheck = await User.findOne({ username: userProName });
    if (!userToCheck) {
      console.log("User to check not found");
      res.status(404).json({ error: "User to check not found" });
      return;
    }

    if (user.following.includes(userProName)) {
      res.json({ followed: true });
    } else {
      res.json({ followed: false });
    }
  } catch (error) {
    console.error('Error checking if followed:', error);
    res.sendStatus(500); 
  }
};



export const updateUserDetails = async (req, res) => {
  try {
    // Access the updated user details
    const { username, city, size, credit, email } = req.body;

    let fileId;
    // Upload image file to Google Drive
    if(req.file){
      fileId = await uploadFileToDrive(req.file);
      fs.unlinkSync(req.file.path);
    }
    

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
    return res.status(200).json(user);
  } catch (error) {
    // Send an error response
    return res.status(500).json({ error: "Internal server error" });
  }
};

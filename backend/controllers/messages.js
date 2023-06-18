import User from "../models/User.js"
import fs from "fs";
import { uploadFileToDrive } from '../utils.js';

export const getMessages = async (req,res) => {
    try {

        const { username, friendUsername } = req.query;
        // Find the user with the given username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the friend in the user's friends array
        const friend = user.friends.find((friend) => friend.username === friendUsername);

        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Return the messages of the friend
        res.status(200).json({ messages: friend.messages });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


export const postMessage = async(req,res) => {
    try {
        const { message, username, friendUsername, hasUnreadMessages } = req.body;
        const parsedMessage = JSON.parse(decodeURIComponent(message));
        delete parsedMessage._id;
        // Find the user in the database
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the friend in the user's friends array
        const friend = user.friends.find((friend) => friend.username === friendUsername);

        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        // Add the new message to the friend's messages array
        friend.messages.push(parsedMessage);
        if(hasUnreadMessages == 2){
            console.log(user.username);
            user.hasUnreadMessages = true;
        }
        // Save the updated user data
        await user.save();

        res.status(200).json({ message: 'Message created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const changeNotUnreadMessages = async (req, res) => {
    const { username } = req.body;
    try {
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
  };
  
  export const addNewFriend = async (req, res) => {
    try {
      const { username, friendUsername, content, type, createdAt } = req.body;
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
  
      const newFriend = {
        username: friendUsername,
        messages: [
          {
            sender: true, // Message sent by the user
            msgType: type,
            content: content,
            createdAt: createdAt,
          },
        ],
      };
      user.friends.push(newFriend);
  
      // Save the updated user data
      await user.save();
  
      // add to friend's friend list, the current user
      const friendUser = await User.findOne({ username: friendUsername });
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
  
      const newUserFriend = {
        username: username,
        messages: [
          {
            sender: false, // Message sent by the user
            msgType: type,
            content: content,
            createdAt: createdAt,
          },
        ],
      };
      friendUser.friends.push(newUserFriend);
      // Save the updated user data
      friendUser.hasUnreadMessages = true;
  
      await friendUser.save();
  
      res.status(200).json({ success: true, message: 'Friend added successfully' });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

export const hasUnreadMessages = (req, res) => {
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
};


export const uploadImage = async (req, res) => {
    try {
      // Process the uploaded image or perform necessary operations
      // Access the uploaded file via `req.file`
      const { myUsername, friendUsername, time } = req.query;
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
        //const imageId = uuidv4();
  
        // Check if the friendUsername is already in the user's friends array
        const friendExists = user.friends.some((friend1) => friend1.username === friendUsername);
  
        if (!friendExists) {
          const newFriend = {
            username: friendUsername,
            messages: [
              {
                sender: true, // Message sent by the user
                msgType: "image",
                content: fileId,
                createdAt: time,
              },
            ],
          };
  
          user.friends.push(newFriend);
  
          // Save the updated user data
          await user.save();
  
          const newUserFriend = {
            username: user.username,
            messages: [
              {
                sender: false, // Message sent by the user
                msgType: "image",
                content: fileId,
                createdAt: time,
              },
            ],
          };
          friend.hasUnreadMessages = true;
          friend.friends.push(newUserFriend);
  
          // Save the updated friend data
          await friend.save();
        } else {
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
        }
  
        res.status(200).json(fileId);
      } else {
        res.status(404).json({ message: "User or friend not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading image" });
    }
};
 
export const uploadVideo = async (req, res) => {
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
          const newFriend = {
            username: friendUsername,
            messages: [
              {
                sender: true,
                msgType: "video",
                content: fileId,
                createdAt: time,
              },
            ],
          };
          user.friends.push(newFriend);
  
          // Save the updated user data
          await user.save();
  
          const newUserFriend = {
            username: user.username,
            messages: [
              {
                sender: false, // Message sent by the user
                msgType: "video",
                content: fileId,
                createdAt: time,
              },
            ],
          };
          friend.friends.push(newUserFriend);
          friend.hasUnreadMessages = true;
          // Save the updated user data
          await friend.save();
        } else {
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
};


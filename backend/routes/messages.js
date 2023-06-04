// Assuming you're using Express.js
import { Router } from 'express';
const router = Router();
import User from '../models/User.js';


/* Get messages of two contacts */ 
router.get('/getMessages', async (req, res) => {
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
    res.json({ messages: friend.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


/* Post a message in chat of contacts */
router.post('/messages', async (req, res) => {
  try {
    const { message, username, friendUsername, hasUnreadMessages } = req.query;
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

    res.json({ message: 'Message created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




export default router;

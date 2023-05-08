import express from "express";
import User from '../models/User.js';

const router = express.Router();


router.get('/getFriends/:username/friends', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        res.status(200).json({ friends: user.friends });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
});

export default router;


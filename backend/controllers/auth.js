import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"
import dotenv from "dotenv";
dotenv.config();
/* REGISTER*/
export const register = async (req, res) => {
    try {
        const {
            username,
            fullName,
            email,
            password,
            picturePath,
            friends,
            myUploads,
            myBoughts,
            favItems,
            city,
            height,
            weight,
            credit,
        } = req.body;
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            myUploads,
            myBoughts,
            favItems,
            city,
            height,
            weight,
            credit: 50
        });
        const savedUser = await newUser.save();
        
        // Set the username in the session
        //req.session.username = savedUser.username;
        res.status(200).json(savedUser);
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGIN */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user){
            return res.status(400).json({ msg: "User does not exist. " });
        }
        const isMatch =  await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ msg: "Invalid credentials. " });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            
        // Set the username in the session
        //req.session.username = user.username;

        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

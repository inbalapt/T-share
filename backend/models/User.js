import mongoose from "mongoose";
import bcrypt from "bcrypt";


const MessageSchema = new mongoose.Schema(
    {
        sender: Boolean,
        msgType:{
            type: String
        },
        content: {
            type: String
        },
        createdAt: String,
        realTime: {
          type: Date,
          default: Date.now
        }
    },
    {timestamps:true}
);


const FriendSchema = new mongoose.Schema(
    {
        username: String,
        messages: [MessageSchema],
    },
);

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 6,
            max: 15,
            unique: true,
        },
        fullName: {
            type: String,
            require: true,
            min: 2,
            max: 25,
        },
        email: {
            type: String,
            require: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            min: 8,
            max: 15
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: [FriendSchema],        
        myUploads: {
            type: Array,
            default: [],
        },
        myBoughts: {
            type: Array,
            default: [],
        },
        favItems: {
            type: Array,
            default: [],
        },
        city: String,
        height: Number,
        weight: Number,
        credit: Number,
    },
    {timestamps:true}
);



const User = mongoose.model("User", UserSchema);
const saltRounds = 10; // Number of salt rounds for bcrypt to generate
const plainPassword = 'inbal123'; // The password entered by the user

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    console.error('Error generating salt:', err);
    return;
  }

  bcrypt.hash(plainPassword, salt, (err, passwordHash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }

    // Create a new user with the hashed password
    const user = new User({
      username: 'john_doe',
      fullName: 'john',
      password: passwordHash, // Store the hashed password in the database
      email: 'jon@gmail.com',
      friends: [],
    });

    // Add a friend and their messages
    const friend = {
      username: 'inbal22',
      messages: [
        {
          sender: true, // Message sent by the user
          msgType: 'text',
          content: 'Hey, how are you?',
          createdAt: "10:25",
        },
        {
          sender: false, // Message sent by the friend
          msgType: 'text',
          content: "I'm doing great!",
          createdAt: "11:30",
        },
      ],
    };
    
    // Add the friend to the user's friends array
    user.friends.push(friend);

    // Save the user to the database
    user
      .save()
      .then(() => {
        console.log('User saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  });
});


bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    console.error('Error generating salt:', err);
    return;
  }

  bcrypt.hash(plainPassword, salt, (err, passwordHash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }

    // Create a new user with the hashed password
    const userInbal = new User({
      username: 'inbal22',
      fullName: 'Inbal Apt',
      password: passwordHash, // Store the hashed password in the database
      email: 'inbalapt@gmail.com',
      friends: [],
      myUploads: ["1684837295465-_ש_(9).jpg"]
    });

    // Add a friend and their messages
    const friend = {
      username: 'john_doe',
      messages: [
        {
          sender: false, // Message sent by the user
          msgType: 'text',
          content: 'Hey, how are you?',
          createdAt: "10:25",
        },
        {
          sender: true, // Message sent by the friend
          msgType: 'text',
          content: "I'm doing great!",
          createdAt: "11:30",
        },
      ],
    };
    // Add a friend and their messages
    const friend2 = {
      username: 'noale',
      messages: [
        {
          sender: false, // Message sent by the user
          msgType: 'text',
          content: 'Hey, how are you?',
          createdAt: "10:25",
        },
        {
          sender: true, // Message sent by the friend
          msgType: 'text',
          content: "I'm doing great!",
          createdAt: "11:30",
        },
      ],
    };
    
    // Add the friend to the user's friends array
    userInbal.friends.push(friend, friend2);
    userInbal.myUploads.push("1");

    // Save the user to the database
    userInbal
      .save()
      .then(() => {
        console.log('User saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  });
});


bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    console.error('Error generating salt:', err);
    return;
  }

  bcrypt.hash(plainPassword, salt, (err, passwordHash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }

    // Create a new user with the hashed password
    const userNoa = new User({
      username: 'noale',
      fullName: 'Noa Leshem',
      password: passwordHash, // Store the hashed password in the database
      email: 'noaleshem@gmail.com',
      friends: [],
      myUploads: []
    });

    // Add a friend and their messages
    const friend = {
      username: 'inbal22',
      messages: [
        {
          sender: true, // Message sent by the user
          msgType: 'text',
          content: 'Hey, how are you?',
          createdAt: "10:25",
        },
        {
          sender: false, // Message sent by the friend
          msgType: 'text',
          content: "I'm doing great!",
          createdAt: "11:30",
        },
      ],
    };
    
    // Add the friend to the user's friends array
    userNoa.friends.push(friend);
    userNoa.myUploads.push("2");


    // Save the user to the database
    userNoa
      .save()
      .then(() => {
        console.log('User saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  });
});

export default User;
//import User from "../models/User";
//import Item from "../models/Item";
//import mongoose from 'mongoose';

const mongoose = require('mongoose');

// Define userOne
export const userOne = {
  _id: new mongoose.Types.ObjectId("648734850287676ef2f140f6"),
  username: 'inbal22',
  fullName: 'Inbal Apt',
  email: 'inbalapt123457@gmail.com',
  password: '$2b$10$qdxQWDmdnQ1DWHhDTM0Uc.o7RfPvY3cJo3I6ahsqLDkDPL2jyI8wi',
  picturePath: '',
  city: 'Haifa',
  credit: 46,
  size: '42',
};

// Define userTwo
export const userTwo = {
  _id: new mongoose.Types.ObjectId("648734850287676ef2f140fe"),
  username: 'noale',
  fullName: 'Noa Leshem',
  email: 'noaleshem123457@gmail.com',
  password: '$2b$10$O0h7TlrOc4oYkeWHaPpIEOZut/KS/GHJJXfEw4ZmFP4nESIY/J.v2',
  picturePath: '',
  city: 'Petah Tiqwa',
  credit: 14,
  size: '36',
};

// Define itemOne
export const itemOne = {
  _id: new mongoose.Types.ObjectId("648860ff79f84b5c5b5e0b88"),
  pictures: ["1JhzRTLr6Z4D_EhyXU4aRWiO9t9rteim1", "1UZae9TeLR0BlQgFjfL10U32kjbhXNluy"],
  sellerUsername: 'ronimaor',
  sellerFullName: 'Roni Maor',
  description: 'Pink shirt',
  userDescription: 'Nice Shirt',
  price: 15,
  size: '38',
  itemLocation: "Ma'Ale Gilboa",
  category: 'tops',
  condition: 'excellent',
  color: 'pink',
  brand: 'tamnoon',
  isBought: false,
  likes: [],
  labels: ["shop","shopping","boutique","cotton","stock","design","casual","shirt","sleeve","garment","hanging","polo","dress","jersey","style"],
};


/*
// This function will be run before each test
export const setupDatabase = async () => {
    // delete all users and items in the DB
    await User.deleteMany();
    await Item.deleteMany();

    // create new users and items based on our predefined data
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Item(itemOne).save();
};
*/
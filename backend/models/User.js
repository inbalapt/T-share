import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            min: 2,
            max: 50,
            unique: true,
        },
        firstName: {
            type: String,
            require: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            require: true,
            min: 2,
            max: 50,
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
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
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
    }
);

const User = mongoose.model("User", UserSchema);
export default User;
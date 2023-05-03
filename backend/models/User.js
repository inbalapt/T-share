import mongoose from "mongoose";

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
    },
    {timestamps:true}
);

const User = mongoose.model("User", UserSchema);
export default User;

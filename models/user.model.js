import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "User name is required"] ,
    trim: true,
    minLength: [3, "Name must be at least 3 characters long"],
    maxLength: [50, "Name must be at most 50 characters long"],
  },
  email:{
    type:String,
    required: [true, "Email is required"],
    unique:true,
    trim:true,
    lowercase: true,
    match : [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    minLength: [5, "Email must be at least 5 characters Long"],
    maxLength: [100, "Email must be at most 100 characters long"],
  },
  password:{
    type: String,
    required:[true, "please provide a password"],
    minLength: [6, "Password must be at Least 6 characters Long"],
  }
},{timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;

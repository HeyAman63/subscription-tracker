import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async(req,res, next)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // create a new user 
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            const error = new Error("please provide all details");
            error.statusCode = 409; 
            throw error;
        }
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            const error = new Error("User Already Exist");
            error.statusCode = 409; 
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword =await bcrypt.hash(password,salt);
        const newUsers = await User.create([{name:name, email:email, password:hashPassword}],{session});
        console.log(newUsers[0]._id);
        const token = jwt.sign({userId:newUsers[0]._id}, JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
        await session.commitTransaction();
        await session.endSession();

        res.status(201).json({
            success:true,
            message:"User Created Successfully",
            data:{
                token,
                user:newUsers[0],
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
} 

export const signIn = async(req,res,next)=>{

    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordVlid = await bcrypt.compare(password,user.password);
        if(!isPasswordVlid){
            const error = new Error("Invalid Password");
            error.statusCode = 404;
            throw error
        }

        const token = jwt.sign({userid:User._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message:"User Login Successfully",
            data:{
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req,res,next)=>{

}
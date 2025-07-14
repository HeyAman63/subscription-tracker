import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: './config/env' });

const { MONGODB_URI, NODE_ENV } = process.env;

if(!MONGODB_URI){
    throw new Error("Please provide the MONGODB_URI in the env.Development/production.local")
}

const connectToDatabase = async ()=>{
    try {
        await mongoose.connect(MONGODB_URI);

        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.log("Error connecting to dataBase : ",error?.message);
    }
}

export default connectToDatabase;
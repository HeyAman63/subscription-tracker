import User from "../models/user.model.js";

export const getUsers = async (req,res,next)=>{
    try {
        const users = await User.find();
        if(!users){
            const error = new Error("Users Not Found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success:true,
            data:users
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req,res,next)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success:true,
        data:user
    });
}
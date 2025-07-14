import { Router } from "express";
import { getUser, getUsers } from "../controller/user.controller.js";
import authorized from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/',getUsers);
userRouter.get('/:id',authorized,getUser);
userRouter.post('/',(req,res) => res.json({message:"create a new user"}));
userRouter.put('/:id',(req,res) => res.json({message:"Update user"}));
userRouter.delete('/:id',(req,res) => res.json({message:"Delete user"}));
export default userRouter;
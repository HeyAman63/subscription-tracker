import { Router } from "express";
import authorized from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscription } from "../controller/subscription.controller.js";

const subRouter = Router();

subRouter.get('/',(req,res)=>res.json({Message:"GET All Subscription details"}));
subRouter.get('/:id',(req,res)=>res.json({Message:"GET Subscription Details"}));
subRouter.post('/',authorized,createSubscription);
subRouter.put('/:id',(req,res)=>res.json({Message:"Update Subscription "}));
subRouter.delete('/:id',(req,res)=>res.json({Message:"Update Subscription "}));
subRouter.get('/user/:id',authorized, getUserSubscription);
subRouter.get('/:id/cancel',(req,res)=>res.json({Message:"Cancel Subscription user"}));
subRouter.get('/upcomming-renewals',(req,res)=>res.json({Message:"get upcomming renewal"}));
export default subRouter; 
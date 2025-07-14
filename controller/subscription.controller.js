import { SERVER_URL } from "../config/env.js";
import { workflowclient } from "../config/upstash.js";
import Subscription from "../models/Subscription.model.js";

export const createSubscription = async(req,res,next)=>{
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user:req.user._id,
        });

        const {workflowRunId} = await workflowclient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId : subscription.id,
            },
            headers:{
                'content-type' : 'application/json'
            },
            retries:0,
        })

        res.status(201).json({success:true, data:{subscription,workflowRunId}});
    } catch (error) {
        next(error);
    }
}

export const getUserSubscription = async (req,res,next) =>{
    try {
        if(req.user.id!=req.params.id){
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscription = await Subscription.find({user:req.user.id});

        res.status(200).json({success:true,data:subscription});
    } catch (error) {
        next(error);
    }
}
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{type:String, 
        required:true,
        trim : true,
        minLength : 3,
        maxLength : 100,
    },
    price:{
        type:Number,
        required:[true,"Subscription price is required"],
        min:[0,"Price must me greater than 0"],
    },
    currency:{
        type:String,
        enum : ['USD','INR',"GBP"],
        default: "USD"
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly', 'yearly'],
    },
    category:{
        type:String,
        enum:['Sports','news','entertainment', 'lifestyle', 'technology', 'finance', 'other'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active', 'cancelled', 'expired'],
        default:"active",
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator: (value)=> value<=new Date(),
            message:"Start date must be in past",
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator: function(value){
                return value > this.startDate;
            },
            message:"Renewal date must be after start date "
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    }
},{timestamps:true});

// Auto calculate renewal date if missing 

subscriptionSchema.pre("save",function(next){
    if(!this.renewalDate){
        const renewaPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewaPeriods[this.frequency]);
    }

    if(this.renewalDate < Date.now()){
        this.status = 'expired';
    }

    next();
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
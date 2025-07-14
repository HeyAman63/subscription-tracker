const errormiddleware = (err, req,res,next)=>{
    try {
        let error = {...err};
        error.message = err.message;

        console.log(err);

        // mongoose bad object id 

        if(err.name === 'CastError'){
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        // mongoose duplicate key 

        if(err.code === 11000){
            const message = "Duplicated value failed to entered"
            error = new Error(message);
            error.statusCode = 400;
        }

        // mongoose validation error
        if(error.name === "ValidationError"){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({message:"success", error:error.message || "Server error"});
    } catch (error) {
        next(error);
    }
} 

export default errormiddleware
import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import {PORT} from './config/env.js'
const app = express();
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errormiddleware from "./middleware/error.middleware.js"
import arkjetmiddleware from './middleware/arkjet.middleware.js';
import workflowrouter from './routes/workflow.router.js';

app.use(express.json());
app.use(urlencoded({extended:false}));
app.use(cookieParser());
app.use(errormiddleware);
app.use(arkjetmiddleware);
app.set('trust proxy', true);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscription',subRouter);
app.use('/api/v1/workflows',workflowrouter);

app.get('/',(req,res)=>{
    res.json({message:"Welcome to the Subscription tracker API!!"});
});

app.listen(PORT,async()=>{
    console.log(`Subscription Tracker is running on : http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;
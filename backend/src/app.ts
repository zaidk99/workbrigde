import express from  "express";
import cors from  "cors";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import serviceRequestsrouter from "./modules/serviceRequests/serviceRequest.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.use('/api/serviceRequests',serviceRequestsrouter);
app.use('/api/projects',projectsRouter);


app.get("/health",(_req,res)=>{
    res.status(200).json({message:"Server Running"});
});

export default app;





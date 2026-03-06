import {Request , Response , NextFunction} from "express";

export const authorizeRoles = (...roles:string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const userRole = (req.user as any)?.role;
        if(!userRole){
            res.status(401).json({message:'unauthorized'});
            return; 
        }

        if(!roles.includes(userRole)){
            res.status(403).json({message:'forbidden no permission'});
            return;
        }
        next();
    };
};




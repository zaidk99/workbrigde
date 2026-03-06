import express from "express";
import {Request , Response} from "express";
import { authServiceslogin } from "./auth.service";

export const logInController = async (req: Request , res: Response) =>{
    const {email , password} = req.body;
    try {
        if(!email || !password){
            res.status(400).json({message:'email and password are required'});
            return;
        }
        const result = await authServiceslogin(email,password);
        res.status(200).json({
            message:'login successfull',
            token: result.token,
            user:result.user
        });       
    } catch (error:any) {
        if(error.message === 'user not found' || error.message === 'invalid credentials') {
            res.status(401).json({message:error.message});
            return;
        }
        res.status(500).json({message:'internal server error'});
    }
}


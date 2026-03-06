import { Request, Response } from "express";
import { createServiceRequestsbyClientService } from "./serviceRequest.service";

export const createServiceRequestController = async (
  req: Request,
  res: Response,
) => {
  
  if (!req.user) {
  res.status(401).json({ message: "Unauthorized" });
  return;
}
  // get hold of inputs
  const client_user_id = req.user.id;
  const {title, description } = req.body;
  
  if(!client_user_id || !title || !description){
    res.status(400).json({message: "all fields are required"});
    return;
  }
  try {
    const result = await createServiceRequestsbyClientService({
      client_user_id,
      title,
      description,
    });
    res.status(201).json({
        message : 'service request created successfully',
        sr : result,
    })
  } catch (error) {
     res.status(500).json({ message: "internal server error" });
  }
};


export const getallSRforSpecificClientServiceRequestController = async(req:Request,res:Response){
  if(!req.user){
    
  }
}
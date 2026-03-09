import { Request, Response } from "express";
import { createServiceRequestsbyClientService, getallServiceRequestsService, getallSRforSpecificClientServiceRequestService, getServiceRequestsByidinitiaterclientandadminservice } from "./serviceRequest.service";

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


export const getallSRforSpecificClientServiceRequestController = async(req:Request,res:Response)=>{
  if(!req.user){
    res.status(401).json({message:"Unauthorized"});
    return;
  }
  const client_user_id = req.user.id;

  if(!client_user_id){
    res.status(400).json({message:"client id is missing"});
    return;
  }
  try {
    const result = await getallSRforSpecificClientServiceRequestService(client_user_id);
    res.status(200).json({
      message:"got all the service requests by the client",
      sr:result,
    })
  } catch (error) {
    res.status(500).json({message:"internal server error"});
  }
};

export const getallServiceRequestsController = async(req:Request ,res:Response)=>{
  if(!req.user){
    res.status(401).json({message:"Unauthorized"});
    return;
  }
  const adminThere = req.user.id;
  if(!adminThere){
    res.status(400).json({message:"Admin is missing"});
    return;
  }
  try {
    const result = await getallServiceRequestsService();
    res.status(200).json({
      message:"got all the service requests made by all clients",
      sr:result,
    })
  } catch (error) {
    res.status(500).json({message:"internal server error"});
  }
};

export const getServiceRequestsByidinitiaterclientandadminController = async(req:Request , res:Response)=>{
  if(!req.user){
    res.status(401).json({message:"unauthorized"});
    return;
  }
  const isClientAdminThere = req.user.id;
  if(!isClientAdminThere){
    res.status(400).json({message:"Admin - Client missing"});
    return;
  }
  const getServiceRequestId = req.params.id as string;
  try {
    const result = await getServiceRequestsByidinitiaterclientandadminservice(getServiceRequestId);
    if(!result){
      res.status(404).json({message:"service request not found"});
      return;
    }
    res.status(200).json({
      message:"got the speicifc id service request ",
      sr:result,
    })
  } catch (error) {
    res.status(500).json({message:"internal server error"});
  }
};


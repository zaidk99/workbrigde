import { Request, Response } from "express";
import { createServiceRequestsbyClientService } from "./serviceRequest.service";

export const createServiceRequestController = async (
  req: Request,
  res: Response,
) => {
  // get hold of inputs
  const { client_user_id, title, description } = req.body;

  try {
    const result = await createServiceRequestsbyClientService({
      client_user_id,
      title,
      description,
    });
    res.status(200).json({
        message : 'service request created successfully',
        sr : result,
    })
  } catch (error) {
     res.status(500).json({ message: "Internal server error" });
  }
};

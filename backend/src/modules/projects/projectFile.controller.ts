import { Response, Request } from "express";
import { uploadProjectFileService } from "./projectFile.service";

export const uploadProjectFileController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "unauthorized",
    });
    return;
  }

  const role = req.user.role;
  const user_id = req.user.id;
  const { project_id } = req.params as { project_id: string };
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      message: "no files uploaded",
    });
    return;
  }

  try {
    await uploadProjectFileService({ project_id, role, user_id, files });
    // new resource is getting created
    res.status(201).json({ 
      success: true,
      message: "files uploaded successfully",
    });
  } catch (error: any) {
    if (error.message === "project does not exist") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    if (error.message === "you are not authorized to upload to this project") {
      res.status(403).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error.message === "Please upload at least one file to upload." ||
      error.message === "Reduce the number of files allowed limit is 10 only" ||
      error.message.includes("exceeds the 20MB size limit") ||
      error.message.includes("is not a supported file type.")
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "unknown error",
    });
  }
};

export const getUploadedFilesController = async (req:Request,res:Response)=>{
  if(!req.user){
    res.status(401).json({
      success:false,
      messge:"unauthorized"
    })
    return;
  }

  const project_id = req.params.project_id as string;
  const user_role = req.user.role;
  const user_id = req.user.id;


  






}

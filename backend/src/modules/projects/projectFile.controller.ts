import { Response, Request } from "express";
import {
  deleteFileFromS3Service,
  getPresignedUrlforFilesService,
  getUploadedFilesService,
  uploadProjectFileService,
} from "./projectFile.service";

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

export const getUploadedFilesController = async (
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

  const project_id = req.params.project_id as string;
  const user_role = req.user.role;
  const user_id = req.user.id;

  try {
    const result = await getUploadedFilesService(
      project_id,
      user_id,
      user_role,
    );
    res.status(200).json({
      success: true,
      message: "successfully got the files ",
      getFiles: result,
    });
  } catch (error: any) {
    if (error.message === "project not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === "this project does not belong to you") {
      res.status(403).json({
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

export const getPresignedUrlforFilesController = async (
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

  const project_id = req.params.project_id as string;
  const file_id = req.params.file_id as string;
  const user_id = req.user.id;
  const user_role = req.user.role;

  try {
    const getviewUrl = await getPresignedUrlforFilesService(
      project_id,
      file_id,
      user_id,
      user_role,
    );
    res.status(200).json({
      success: true,
      message: "successfully got presigned url for the file",
      viewUrl: getviewUrl,
    });
  } catch (error: any) {
    if (
      error.message === "project does not exist" ||
      error.message === "this file does not belong to this project"||
      error.message === "file not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === "this project does not belong to you") {
      res.status(403).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return;
  }
};

export const deleteFileFromS3Controller = async(req:Request , res:Response)=>{
 if(!req.user){
  res.status(401).json({
    success:false,
    message:"unauthorized",
  })
  return;
 }

 const project_id = req.params.project_id as string;
 const user_role = req.user.role;
 const file_id = req.params.file_id as string;


 try {
   await deleteFileFromS3Service(project_id,user_role,file_id);
   res.status(204).json({
    success:true,
    message:"successfully deleted the file",
   });
 } catch (error:any) {
    if(error.message === "you are not authorized to delete" ){
       res.status(403).json({
         success:false,
         message:error.message,
       })
       return;
    }
    if(error.message === )

 }
}
  
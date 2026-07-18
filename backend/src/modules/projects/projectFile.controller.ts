import { Response , Request } from "express";
import { uploadProjectFileService } from "./projectFile.service";


export const uploadProjectFileController = async (res:Response , req:Request )=>{
    if(!req.user){
        res.status(401).json({
            success:false,
            message:"unauthorized"
        })
        return;
    }

    const role = req.user.role;
    const user_id = req.user.id;
    const { project_id } = req.params as { project_id: string };
    const files = req.files as Express.Multer.File[];

    if(!files || files.length === 0){
        res.status(400).json({
            success:false,
            message:"no files uploaded"
        });
        return;
    }

    await uploadProjectFileService({project_id, role , user_id , files});

    res.status(200).json({
        
    })
    
  
}
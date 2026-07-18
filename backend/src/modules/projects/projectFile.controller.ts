import { Response , Request } from "express";


export const uploadProjectFileController = async (res:Response , req:Request )=>{
    if(!req.user){
        res.status(401).json({
            success:false,
            message:"unauthorized"
        })
        return;
    }

    const user_role = req.user.role;
    const user_id = req.user.id;
    const {project_id} = req.params;
    const files = req.files as Express.Multer.File[];

    if(!files || files.length === 0){
        res.status(400).json({
            success:false,
            message:"no files uploaded"
        });
        return;
    }

    await 
    
  
}
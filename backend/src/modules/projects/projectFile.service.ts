import { PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { pool } from "../../config/db";
import multer = require("multer");

interface uploadInput {
    project_id : string,
    original_file_name:string,
    role:string,
    user_id:string,
    files: Express.Multer.File[]
}

interface UploadToS3Result {
  objectKey: string;
  response: PutObjectCommandOutput;
}
export const uploadProjectFile = async({
    project_id,
    original_file_name,
    role,
    user_id,
    files,

}:uploadInput):Promise<UploadToS3Result>=>{
    
    const checkProject = await pool.query(`
        SELECT * FROM projects WHERE id = $1;
        `,[project_id]);
    
    if(checkProject.rows.length === 0){
        throw new Error("project does not exist");
    }

    if(role=='client'){
        const checkProjectOwner = await pool.query(`
            SELECT * FROM projects WHERE id = $1 AND client_user_id = $2;`,[project_id,user_id]);

        if(checkProjectOwner.rows.length === 0){
            throw new Error("you are not authorized to upload to this project");
        };



    

    }

}
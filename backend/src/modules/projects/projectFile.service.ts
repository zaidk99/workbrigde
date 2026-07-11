import { PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { pool } from "../../config/db";
import multer = require("multer");
import { uploadToS3Bucket } from "./s3.service";

interface uploadInput {
  project_id: string;
  role: string;
  user_id: string;
  files: Express.Multer.File[];
}

interface InputForS3 {
  objectKey: string;
  body: Buffer;
  contentType: string;
}

interface UploadFileMetaData {
    objectKey:string;
    originalFileName: string;
    mimeType:string;
    fileSize: number;
}


export const uploadProjectFile = async ({
  project_id,
  role,
  user_id,
  files,
}: uploadInput) => {
  const checkProject = await pool.query(
    `
        SELECT * FROM projects WHERE id = $1;
        `,
    [project_id],
  );

  if (checkProject.rows.length === 0) {
    throw new Error("project does not exist");
  }

    if (role == "client") {
    const checkProjectOwner = await pool.query(
      `
            SELECT * FROM projects WHERE id = $1 AND client_user_id = $2;`,
      [project_id, user_id],
    );

    if (checkProjectOwner.rows.length === 0) {
      throw new Error("you are not authorized to upload to this project");
    };

    if (files.length === 0) {
    throw new Error("Please upload at least one file to upload.");
    }

    if(files.length > 10){
        throw new Error("Reduce the number of files allowed limit is 10 only");
    }

    const allowedType = "application/pdf";
    const maxSize = 10*1024*1024;
    
    for (const file of files){
        if(file.size > maxSize){
            throw new Error(`${file.originalname} exceeds the 10MB size limit`);
        }
        if(!allowedType.includes(file.mimetype)){
            throw new Error(`${file.originalname} is not a supported file type.`);
        }
    }
   
    const uploadedFiles: UploadFileMetaData[] = [];

    for(const file of files){
        const objectKey = `projects/${project_id}/${Date.now()}-${file.originalname}`;
        await uploadToS3Bucket({
            objectKey,
            body:file.buffer,
            contentType:file.mimetype
        });
        uploadedFiles.push({
            objectKey,
            originalFileName:file.originalname,
            mimeType:file.mimetype,
            fileSize: file.size,
        });
    }

    for(const uploadedFile of uploadedFiles) {
        await pool.query(
            `INSERT INTO project_files (project_id , uploaded_by , original_file_name , object_key , mime_type , file_size) VALUES($1,$2,$3,$4,$5,$6)`,
            [
                project_id,
                user_id,
                uploadedFile.originalFileName,
                uploadedFile.objectKey,
                uploadedFile.mimeType,
                uploadedFile.fileSize,
            ]
        );
    }

  }
};

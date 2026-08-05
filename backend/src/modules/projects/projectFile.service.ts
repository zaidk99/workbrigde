import { pool } from "../../config/db";
import multer from "multer";
import {
  deleteFroms3Bucket,
  uploadToS3Bucket,
  viewFromS3Bucket,
} from "./s3.service";

interface uploadInput {
  project_id: string;
  role: string;
  user_id: string;
  files: Express.Multer.File[];
}

interface UploadFileMetaData {
  objectKey: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
}

interface ProjectFile {
  id: string;
  project_id: string;
  uploaded_by: string;
  orginal_file_name: string;
  object_key: string;
  mime_type: string;
  files_size: number;
  created_at: Date;
  updated_at: Date;
}

interface inputsForPresignedUrl {
  project_id: string;
  file_id: string;
  user_id: string;
  user_role: string;
}

export const uploadProjectFileService = async ({
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
      `SELECT * FROM projects WHERE id = $1 AND client_user_id = $2;`,
      [project_id, user_id],
    );
    if (checkProjectOwner.rows.length === 0) {
      throw new Error("you are not authorized to upload to this project");
    }
  }

  if (files.length === 0) {
    throw new Error("Please upload at least one file to upload.");
  }

  if (files.length > 10) {
    throw new Error("Reduce the number of files allowed limit is 10 only");
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/zip",
    "text/plain",
  ];
  const maxSize = 20 * 1024 * 1024;

  for (const file of files) {
    if (file.size > maxSize) {
      throw new Error(`${file.originalname} exceeds the 20MB size limit`);
    }
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`${file.originalname} is not a supported file type.`);
    }
  }

  const uploadedFiles: UploadFileMetaData[] = [];

  try {
    for (const file of files) {
      const objectKey = `projects/${project_id}/${Date.now()}-${file.originalname}`;
      await uploadToS3Bucket({
        objectKey,
        body: file.buffer,
        contentType: file.mimetype,
      });
      uploadedFiles.push({
        objectKey,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
      });
    }
  } catch (error) {
    for (const uploadFile of uploadedFiles) {
      await deleteFroms3Bucket({ objectKey: uploadFile.objectKey });
    }
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const insertedFiles = [];
    for (const uploadedFile of uploadedFiles) {
      const result = await client.query(
        `INSERT INTO project_files (project_id , uploaded_by , original_file_name , object_key , mime_type , file_size) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [
          project_id,
          user_id,
          uploadedFile.originalFileName,
          uploadedFile.objectKey,
          uploadedFile.mimeType,
          uploadedFile.fileSize,
        ],
      );
      insertedFiles.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return insertedFiles;
  } catch (error) {
    await client.query("ROLLBACK");
    for (const uploadedFile of uploadedFiles) {
      await deleteFroms3Bucket({ objectKey: uploadedFile.objectKey });
    }
    throw error;
  } finally {
    client.release();
  }
};

export const getUploadedFilesService = async (
  project_id: string,
  user_id: string,
  role: string,
): Promise<ProjectFile[]> => {
  const checkProject = await pool.query(
    `SELECT * FROM projects WHERE id = $1`,
    [project_id],
  );

  if (checkProject.rows.length === 0) {
    throw new Error("project not found");
  }

  if (role === "client") {
    // checking if the client owns the project id or not
    const checkifProjectBelongstoClient = await pool.query(
      `SELECT * FROM projects WHERE id = $1 AND client_user_id = $2`,
      [project_id, user_id],
    );
    if (checkifProjectBelongstoClient.rows.length === 0) {
      throw new Error("this project does not belong to you");
    }
  }

  if (role === "employee") {
    const checkForprojectBelongsToEmployee = await pool.query(
      `SELECT * FROM project_employees WHERE project_id = $1 AND employee_id = $2`,
      [project_id, user_id],
    );
    if (checkForprojectBelongsToEmployee.rows.length === 0) {
      throw new Error("this project does not belong to you");
    }
  }

  const getFiles = await pool.query(
    ` SELECT *, file_size::int AS file_size FROM project_files WHERE project_id = $1`,
    [project_id],
  );

  return getFiles.rows;
};

export const getPresignedUrlforFilesService = async (
  project_id: string,
  file_id: string,
  user_id: string,
  user_role: string,
): Promise<string> => {
  const checkProject = await pool.query(
    `SELECT id FROM projects WHERE id = $1`,
    [project_id],
  );

  if (checkProject.rows.length != 0) {
    const checkFileBelongsTothisProject = await pool.query(
      `SELECT * FROM project_files WHERE id=$1 AND project_id = $2 `,
      [file_id, project_id],
    );
    if (checkFileBelongsTothisProject.rows.length === 0) {
      throw new Error("this file does not belong to this project");
    }
  } else {
    throw new Error("project does not exist");
  }

  if (user_role === "client") {
    // checking if the client owns the project id or not
    const checkifProjectBelongstoClient = await pool.query(
      `SELECT * FROM projects WHERE id = $1 AND client_user_id = $2`,
      [project_id, user_id],
    );
    if (checkifProjectBelongstoClient.rows.length === 0) {
      throw new Error("this project does not belong to you");
    }
  }
  if (user_role === "employee") {
    const checkForprojectBelongsToEmployee = await pool.query(
      `SELECT * FROM project_employees WHERE project_id = $1 AND employee_id = $2`,
      [project_id, user_id],
    );
    if (checkForprojectBelongsToEmployee.rows.length === 0) {
      throw new Error("this project does not belong to you");
    }
  }

  const fileRecord = await pool.query(
    `SELECT object_key FROM project_files WHERE id=$1 AND project_id = $2`,
    [file_id, project_id],
  );
  if (fileRecord.rows.length === 0) {
    throw new Error("file not found");
  }

  const objectKey = fileRecord.rows[0].object_key;

  const viewFileUrl = await viewFromS3Bucket({ objectKey });
  return viewFileUrl;
};

export const deleteFileFromS3Service = async (
  project_id: string,
  user_id: string,
  user_role: string,
  file_id: string,
): Promise<void> => {
  if (user_role != "admin") {
    throw new Error("you are not authorized to delete");
  }

  const client = await pool.connect();
  const fileRecord = await pool.query(
    `SELECT object_key FROM project_files WHERE id=$1 AND project_id = $2`,
    [file_id, project_id],
  );
  if (fileRecord.rows.length === 0) {
    throw new Error("file not found");
  }

  const objectKey = fileRecord.rows[0].object_key;

  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM project_files WHERE id = $1`, [file_id]);
    await client.query("COMMIT");

    // DB DELETE IS SUCCESSFUL MOVING TO s3 delete

    try {
      await deleteFroms3Bucket({ objectKey });
    } catch (s3Error) {
      // s3 clean up queue as s3 deletions cant be rolled back so to avoid the files being orphaned we put them in the queue and later delete them needs full implementation
      // await pool.query(`INTERT INTO s3_cleanup_queue ......`)
      throw new Error("unable to delete from file in storage");
    }
  } catch (dbError) {
    await client.query("ROLLBACK");
    throw dbError;
  } finally {
    client.release();
  }
};

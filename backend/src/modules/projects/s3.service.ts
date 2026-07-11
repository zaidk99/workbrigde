import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";

import s3client from "../../config/s3";
import { BUCKET_NAME } from "../../config/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface InputForS3 {
  objectKey: string;
  body: Buffer;
  contentType: string;
}

interface UploadToS3Result {
  objectKey: string;
}

interface S3ObjectKeyInput {
  objectKey: string;
}

// Upload TO S3 buket function

export const uploadToS3Bucket = async ({
  objectKey,
  body,
  contentType,
}: InputForS3): Promise<UploadToS3Result> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: body,
    ContentType: contentType,
  });
  const response = await s3client.send(command);

  return {
    objectKey,
  };
};

// View Object From the Bucket

export const viewFromS3Bucket = async ({ objectKey }: S3ObjectKeyInput) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });
  const viewUrl = await getSignedUrl(s3client, command, { expiresIn: 900 });
  return viewUrl;
};

// Delete Object from the S3 Bucket
export const deleteFroms3Bucket = async ({
  objectKey,
}: S3ObjectKeyInput): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  const response = await s3client.send(command);
  return response;
};

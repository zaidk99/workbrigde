import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import s3client from "../../config/s3";
import { BUCKET_NAME } from "../../config/s3";

interface InputForS3 {
  objectKey: string;
  body: Buffer;
  contentType: string;
}

interface UploadToS3Result {
  objectKey: string;
  response: PutObjectCommandOutput;
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
    response,
  };
};




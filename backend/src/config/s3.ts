import {ENV} from "../config/env";
import { S3Client } from "@aws-sdk/client-s3";

const s3client = new S3Client({
    region:ENV.AWS_REGION,
    credentials:{
        accessKeyId: ENV.AWS_ACCESS_KEY_ID!,
        secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY!
    }
});

export const BUCKET_NAME = ENV.AWS_BUCKET_NAME!;
export default s3client;
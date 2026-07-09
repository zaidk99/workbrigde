import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT : process.env.PORT || 3000,
    JWT_SECRET : process.env.JWT_SECRET,
    DATABASE_URL : process.env.DATABASE_URL,
    DB_MAX : Number(process.env.max),
    DB_IDLETIMEOUT: Number(process.env.idleTimeoutMilli),
    DB_CONNECTIONTIMEOOUT : Number(process.env.connectionTimeoutMillis),
    AWS_REGION:process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME,
    NODE_ENV : process.env.NODE_ENV
}
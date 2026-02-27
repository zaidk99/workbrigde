import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT : process.env.PORT || 3000,
    JWT_SECRET : process.env.JWT_SECRET,

    DATABASE_URL : process.env.DATABASE_URL,
    DB_MAX : Number(process.env.max),
    DB_IDLETIMEOUT: Number(process.env.idleTimeoutMilli),
    DB_CONNECTIONTIMEOOUT : Number(process.env.connectionTimeoutMillis),
    NODE_ENV : process.env.NODE_ENV
}
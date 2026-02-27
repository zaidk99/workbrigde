import pg from "pg";
import { Pool } from "pg";
import { ENV } from "./env";


const pool = new Pool ({
    connectionString : ENV.DATABASE_URL,
    max : ENV.DB_MAX , 
    idleTimeoutMillis : ENV.DB_IDLETIMEOUT,
    connectionTimeoutMillis : ENV.DB_CONNECTIONTIMEOOUT,
    ssl: ENV.NODE_ENV === "production" ? {rejectUnauthorized:false} : false,
});

const connectDB = async ()=>{
    try {
        await pool.query("SELECT NOW()");
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connected Failed :" , error);
        process.exit(1);
    }
}

export {Pool , connectDB};

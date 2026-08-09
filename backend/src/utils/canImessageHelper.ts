import { pool } from  "../config/db";

export const canImessage = async(sender_id,sender_role,receiver_id:string)=>{

        const receiver_role = await pool.query(`SELECT role FROM users WHERE id = $1`,[receiver_id]);
        
}
import { pool } from "../../config/db";


export const sendMessagetospecifiUserId = async(
    senderId: string,
    receiverId: string,
    content:string,
)=>{
    const receiver = await pool.query(`SELECT id, role FROM users WHERE id = $1`,[receiverId]);
    if(receiver.rows.length === 0){
        throw new Error(`receiver does not exist`)
    }

}

export const getMessagesForSpecificUserId = async()=>{

}

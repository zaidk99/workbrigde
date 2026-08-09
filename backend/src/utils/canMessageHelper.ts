import { pool } from  "../config/db";

export const canMessage = async(sender_id:string,sender_role:string,receiver_id:string)=>{

        const get_receiver_role = await pool.query(`SELECT role FROM users WHERE id = $1`,[receiver_id]);

        const receiver_role = get_receiver_role.rows[0]?.role;
        console.log("receiver_role in helper function canMessage :" , receiver_role);


        if(!receiver_role){
                throw new Error("reciever not found");
        }

        if(sender_role === 'admin' || receiver_role === 'admin'){
                return true;
        } else {
                
        }








} 
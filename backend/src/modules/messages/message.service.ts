import { pool } from "../../config/db";
import { canMessage } from "../../utils/canMessageHelper";


export const sendMessageToSpecificUserId = async (
    senderId: string,
    receiverId: string,
    content: string,
    senderRole: string,
) => {
    const receiver = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [receiverId]
    );

    if (receiver.rows.length === 0) {
        throw new Error("Receiver does not exist");
    }

    if (senderId === receiverId) {
        throw new Error("Cannot send message to yourself");
    }

    const allowed = await canMessage(
        senderId,
        receiverId,
        senderRole
    );

    if (!allowed) {
        throw new Error("Not authorized to send message to this user");
    }

    const messageInsertQuery = `
        INSERT INTO messages (
            sender_id,
            receiver_id,
            content
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            sender_id,
            receiver_id,
            content,
            created_at,
            updated_at;
    `;

    const result = await pool.query(messageInsertQuery, [
        senderId,
        receiverId,
        content
    ]);

    return result.rows[0];
};


export const getMessagesForSpecificUserId = async()=>{

}

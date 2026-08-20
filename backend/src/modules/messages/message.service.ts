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

export const getMessagesForSpecificUserId = async (
    currentUserId: string,
    otherUserId: string,
    currentUserRole: string,
) => {

    const otherUser = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [otherUserId]
    );

    if (otherUser.rows.length === 0) {
        throw new Error("User does not exist");
    }


    if (currentUserId === otherUserId) {
        throw new Error("Cannot get conversation with yourself");
    }


    const allowed = await canMessage(
        currentUserId,
        otherUserId,
        currentUserRole
    );

    if (!allowed) {
        throw new Error(
            "Not authorized to view conversation with this user"
        );
    }


    const messagesQuery = `
        SELECT
            id,
            sender_id,
            receiver_id,
            content,
            created_at,
            updated_at
        FROM messages
        WHERE
            (sender_id = $1 AND receiver_id = $2)
            OR
            (sender_id = $2 AND receiver_id = $1)
        ORDER BY created_at ASC;
    `;

    const result = await pool.query(messagesQuery, [
        currentUserId,
        otherUserId
    ]);

    return result.rows;
};

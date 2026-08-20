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


export const getMessageConversations = async (
    currentUserId: string
) => {
    const conversationsQuery = `
        WITH latest_conversations AS (
            SELECT DISTINCT ON (
                CASE
                    WHEN m.sender_id = $1 THEN m.receiver_id
                    ELSE m.sender_id
                END
            )
                CASE
                    WHEN m.sender_id = $1 THEN m.receiver_id
                    ELSE m.sender_id
                END AS other_user_id,

                u.name AS other_user_name,
                u.email AS other_user_email,
                u.role AS other_user_role,

                m.id AS message_id,
                m.content AS last_message,
                m.created_at AS last_message_at

            FROM messages m

            JOIN users u
                ON u.id = CASE
                    WHEN m.sender_id = $1 THEN m.receiver_id
                    ELSE m.sender_id
                END

            WHERE
                m.sender_id = $1
                OR m.receiver_id = $1

            ORDER BY
                CASE
                    WHEN m.sender_id = $1 THEN m.receiver_id
                    ELSE m.sender_id
                END,
                m.created_at DESC
        )

        SELECT *
        FROM latest_conversations
        ORDER BY last_message_at DESC;
    `;

    const result = await pool.query(
        conversationsQuery,
        [currentUserId]
    );

    return result.rows;
};
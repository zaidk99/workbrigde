import { Request, Response } from "express";
import { getMessageConversations, getMessagesForSpecificUserId, sendMessageToSpecificUserId } from "./message.service";
import  typeValidations  from "./message.validation";

export const sendMessage = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const validatedData = typeValidations.parse(req.body);

        const senderId = req.user.id;
        const senderRole = req.user.role;

        const { receiverId, content } = validatedData;

        const message = await sendMessageToSpecificUserId(
            senderId,
            receiverId,
            content,
            senderRole
        );

        return res.status(201).json({
            success: true,
            message
        });

    } catch (error) {

        if (error instanceof Error) {

            if (error.message === "Receiver does not exist") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Cannot send message to yourself") {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Not authorized to send message to this user") {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};


export const getMessagesForSpecificUserIdController = async (
    req: Request<{ userId: string }>,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;

        const { userId: otherUserId } = req.params;

        const messages = await getMessagesForSpecificUserId(
            currentUserId,
            otherUserId,
            currentUserRole
        );

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {

        if (error instanceof Error) {

            if (error.message === "User does not exist") {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            if (
                error.message ===
                "Cannot get conversation with yourself"
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            if (
                error.message ===
                "Not authorized to view conversation with this user"
            ) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to get conversation",
        });
    }
};

export const getMessageConversationsController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const currentUserId = req.user.id;

        const conversations = await getMessageConversations(
            currentUserId
        );

        return res.status(200).json({
            success: true,
            conversations,
        });

    } catch (error) {
        console.error(
            "Get message conversations error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get conversations",
        });
    }
};
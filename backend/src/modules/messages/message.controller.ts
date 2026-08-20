import { Request, Response } from "express";
import { sendMessageToSpecificUserId } from "./message.service";
import { typeValidations } from "./message.validation";

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
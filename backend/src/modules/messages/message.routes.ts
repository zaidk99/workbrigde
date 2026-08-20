import express from "express";
import { authenticate } from "../../middleware/authenticate";
import {
    getMessageConversationsController,
    getMessagesForSpecificUserIdController,
    searchMessageableUsersController,
    sendMessage,
} from "./message.controller";

const router = express.Router();


router.post(
    "/",
    authenticate,
    sendMessage
);


router.get(
    "/search",
    authenticate,
    searchMessageableUsersController
);


router.get(
    "/",
    authenticate,
    getMessageConversationsController
);


router.get(
    "/:userId",
    authenticate,
    getMessagesForSpecificUserIdController
);

export default router;
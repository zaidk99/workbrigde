import express from "express";
import { authenticate } from "../../middleware/authenticate";
import {
    getMessageConversationsController,
  getMessagesForSpecificUserIdController,
  sendMessage,
} from "./message.controller";

const router = express.Router();

router.post("/", authenticate, sendMessage);
router.get(
  "/:userId",

  authenticate,

  getMessagesForSpecificUserIdController,
);
router.get(

    "/",

    authenticate,

    getMessageConversationsController

);


export default router;

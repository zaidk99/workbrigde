import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { getMessagesForSpecificUserIdController, sendMessage } from "./message.controller";

const router = express.Router();

router.post(
  "/",
  authenticate,
  sendMessage,
);
router.get(

    "/:userId",

    authenticate,

    getMessagesForSpecificUserIdController

);

export default router;
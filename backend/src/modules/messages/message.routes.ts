import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { sendMessage } from "./message.controller";

const router = express.Router();

router.post(
  "/",
  authenticate,
  sendMessage,
);

export default router;
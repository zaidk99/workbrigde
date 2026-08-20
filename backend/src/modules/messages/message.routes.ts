import { Router } from "express";
import { sendMessage } from "./message.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post(
    "/",
    authenticate,
    sendMessage
);

export default router;
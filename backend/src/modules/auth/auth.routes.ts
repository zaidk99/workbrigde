import express from "express";
import { logInController } from "./auth.controller";
const router = express.Router();


router.post('/login',logInController);


export default router;

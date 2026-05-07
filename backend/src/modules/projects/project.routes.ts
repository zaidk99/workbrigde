import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),);


export default router;
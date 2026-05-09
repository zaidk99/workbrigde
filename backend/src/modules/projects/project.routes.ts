import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { getallProjectsinitiatoradminOnlyController, getallProjectsSpecifictoClientController } from "./project.controller";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),getallProjectsinitiatoradminOnlyController);
router.get("/my",authenticate,authorizeRoles('client'),getallProjectsSpecifictoClientController);



export default router;
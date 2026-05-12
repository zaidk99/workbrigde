import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { getallassignedprojectsbyemployeeController, getallProjectsinitiatoradminOnlyController, getallProjectsSpecifictoClientController } from "./project.controller";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),getallProjectsinitiatoradminOnlyController);
router.get("/my",authenticate,authorizeRoles('client'),getallProjectsSpecifictoClientController);
router.get("/assigned",authenticate,authorizeRoles('employee'),getallassignedprojectsbyemployeeController)

export default router;
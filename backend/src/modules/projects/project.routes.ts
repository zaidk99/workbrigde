import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { getallassignedprojectsbyemployeeController, getallProjectsinitiatoradminOnlyController, getallProjectsSpecifictoClientController, getProjectsByidcontroller } from "./project.controller";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),getallProjectsinitiatoradminOnlyController);
router.get("/my",authenticate,authorizeRoles('client'),getallProjectsSpecifictoClientController);
router.get("/assigned",authenticate,authorizeRoles('employee'),getallassignedprojectsbyemployeeController);
router.get("/:project_id",authenticate,authorizeRoles('client','employee','admin'),getProjectsByidcontroller);
// api to assign employees admin only
router.post("")

export default router;
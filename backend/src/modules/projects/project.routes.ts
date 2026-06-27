import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { getallassignedprojectsbyemployeeController, getallProjectsinitiatoradminOnlyController, getallProjectsSpecifictoClientController, getEmpolyeesandthereworkloadforassigningProjectsController, getProjectsByidcontroller } from "./project.controller";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),getallProjectsinitiatoradminOnlyController);
router.get("/my",authenticate,authorizeRoles('client'),getallProjectsSpecifictoClientController);
router.get("/assigned",authenticate,authorizeRoles('employee'),getallassignedprojectsbyemployeeController);
router.get("/:project_id/employeesandworkload",authenticate,authorizeRoles('admin'),getEmpolyeesandthereworkloadforassigningProjectsController);
router.get("/:project_id",authenticate,authorizeRoles('client','employee','admin'),getProjectsByidcontroller);
// api to assign employees admin only
router.post(":project_id/assinging-employees",authenticate,authorizeRoles('admin'));

export default router;
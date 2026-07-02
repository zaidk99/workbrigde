import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { assignEmployeestoProjectController, getallassignedprojectsbyemployeeController, getallProjectsinitiatoradminOnlyController, getallProjectsSpecifictoClientController, getAssignedEmployeesofAprojectController, getEmpolyeesandthereworkloadforassigningProjectsController, getProjectsByidcontroller, projectStatusUpdateController, unassignEmployeestoProjectController } from "./project.controller";



const router = express.Router();


router.get("/all-projects",authenticate,authorizeRoles('admin'),getallProjectsinitiatoradminOnlyController);
router.get("/my",authenticate,authorizeRoles('client'),getallProjectsSpecifictoClientController);
router.get("/assigned",authenticate,authorizeRoles('employee'),getallassignedprojectsbyemployeeController);
router.get("/:project_id/employeesandworkload",authenticate,authorizeRoles('admin'),getEmpolyeesandthereworkloadforassigningProjectsController);
router.get("/:project_id/employees",authenticate,authorizeRoles('admin'),getAssignedEmployeesofAprojectController);
router.get("/:project_id",authenticate,authorizeRoles('client','employee','admin'),getProjectsByidcontroller);
// api to assign employees admin only
router.post("/:project_id/assigning-employees",authenticate,authorizeRoles('admin'),assignEmployeestoProjectController);
// api to unassign employees admin only
router.delete("/:project_id/unassigning-employees",authenticate,authorizeRoles('admin'),unassignEmployeestoProjectController);
router.patch("/:project_id/status",authenticate,authorizeRoles('employee','admin'),projectStatusUpdateController);



export default router;
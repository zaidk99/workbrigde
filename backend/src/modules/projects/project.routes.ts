import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import {
  assignEmployeestoProjectController,
  getallassignedprojectsbyemployeeController,
  getallProjectsinitiatoradminOnlyController,
  getallProjectsSpecifictoClientController,
  getAssignedEmployeesofAprojectController,
  getEmpolyeesandthereworkloadforassigningProjectsController,
  getProjectsByidcontroller,
  projectStatusUpdateController,
  unassignEmployeestoProjectController,
} from "./project.controller";
import {
  deleteFileFromS3Controller,
  getPresignedUrlforFilesController,
  getUploadedFilesController,
  uploadProjectFileController,
} from "./projectFile.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get(
  "/all-projects",
  authenticate,
  authorizeRoles("admin"),
  getallProjectsinitiatoradminOnlyController,
);
router.get(
  "/my",
  authenticate,
  authorizeRoles("client"),
  getallProjectsSpecifictoClientController,
);
router.get(
  "/assigned",
  authenticate,
  authorizeRoles("employee"),
  getallassignedprojectsbyemployeeController,
);

router.get(
  "/:project_id/employeesandworkload",
  authenticate,
  authorizeRoles("admin"),
  getEmpolyeesandthereworkloadforassigningProjectsController,
);

router.get(
  "/:project_id/employees",
  authenticate,
  authorizeRoles("admin"),
  getAssignedEmployeesofAprojectController,
);

// api to get the files
router.get(
  "/:project_id/files",
  authenticate,
  authorizeRoles("admin", "client", "employee"),
  getUploadedFilesController,
);
// api to get presigned urls for the files to view
router.get(
  "/:project_id/files/:file_id/url",
  authenticate,
  authorizeRoles('admin','client','employee'),
  getPresignedUrlforFilesController,
);

router.delete(
  "/:project_id/files/:file_id",
  authenticate,
  authorizeRoles('admin'),
  deleteFileFromS3Controller,
)

// api to assign employees admin only
router.post(
  "/:project_id/assigning-employees",
  authenticate,
  authorizeRoles("admin"),
  assignEmployeestoProjectController,
);
// api to unassign employees admin only
router.delete(
  "/:project_id/unassigning-employees",
  authenticate,
  authorizeRoles("admin"),
  unassignEmployeestoProjectController,
);

router.patch(
  "/:project_id/status",
  authenticate,
  authorizeRoles("employee", "admin"),
  projectStatusUpdateController,
);

router.post(
  "/:project_id/upload-project-files",
  authenticate,
  authorizeRoles("admin", "client"),
  upload.array("files", 10),
  uploadProjectFileController,
);





router.get(
  "/:project_id",
  authenticate,
  authorizeRoles("client", "employee", "admin"),
  getProjectsByidcontroller,
);

export default router;

import express from "express";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { authenticate } from "../../middleware/authenticate";
import { createServiceRequestController } from "./serviceRequest.controller";

const router = express.Router();


router.post("/create-service-request",authenticate,authorizeRoles('client'),createServiceRequestController);
// admin gets all req from all clients
router.get("/all",authenticate,authorizeRoles('admin'));
// get all req by logged in client
router.get("/my",authenticate,authorizeRoles('client'));
router.get("/:id",authenticate,authorizeRoles('client'));

export default router;


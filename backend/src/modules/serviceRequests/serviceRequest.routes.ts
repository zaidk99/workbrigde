import express from "express";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { authenticate } from "../../middleware/authenticate";
import { createServiceRequestController } from "./serviceRequest.controller";

const router = express.Router();


router.post("/service-requests",authenticate,authorizeRoles('client'),createServiceRequestController);
// admin gets all req from all clients
router.get("/service-requests/all",authenticate,authorizeRoles('admin'));
// get all req by logged in client
router.get("/service-requests/:id",authenticate,authorizeRoles('client'));
router.get("/service-requests",authenticate,authorizeRoles('client'));




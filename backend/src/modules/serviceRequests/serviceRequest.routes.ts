import express from "express";
import { Router } from "express";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();


router.post("/service-requests",authenticate,authorizeRoles('client'));
// get all req by logged in client
router.get("/service-requests",authenticate,authorizeRoles('client'));
// get specific one req by its id 
router.get("service-requests/:id",authenticate,authorizeRoles('client'));
// admin gets all req from all clients
router.get("/service-requests/all",authenticate,authorizeRoles('admin'));

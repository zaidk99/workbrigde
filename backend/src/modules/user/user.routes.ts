import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/authorizeRoles";
import { deactivateUserByidController, deleteUserByIdController, getUserByrolecontroller, registerUserController } from "./user.controller";

const router = express.Router();

router.post('/registeruser',authenticate,authorizeRoles('admin'),registerUserController);

router.get('/',authenticate,authorizeRoles('admin'),authenticate,authorizeRoles('admin'),getUserByrolecontroller);

router.patch('/:id',authenticate,authorizeRoles('admin'),deactivateUserByidController)

router.delete('/:id',authenticate,authorizeRoles('admin'),authenticate,authorizeRoles('admin'),deleteUserByIdController);



export default router;


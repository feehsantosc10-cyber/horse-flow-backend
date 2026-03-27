import { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.get("/users", adminController.listUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.patch("/users/:id/status", adminController.updateUserStatus);

export default router;

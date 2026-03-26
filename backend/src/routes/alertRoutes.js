import { Router } from "express";
import * as careController from "../controllers/careController.js";

const router = Router();

router.get("/", careController.listAlerts);
router.get("/settings", careController.listSettings);
router.put("/settings/:careType", careController.updateSetting);

export default router;

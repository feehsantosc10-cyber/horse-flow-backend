import { Router } from "express";
import * as horseController from "../controllers/horseController.js";
import * as feedingController from "../controllers/feedingController.js";
import * as weightController from "../controllers/weightController.js";
import * as careController from "../controllers/careController.js";
import * as reproductionController from "../controllers/reproductionController.js";
import * as timelineController from "../controllers/timelineController.js";

const router = Router();

router.get("/", horseController.list);
router.post("/", horseController.create);
router.get("/:horseId", horseController.getById);
router.put("/:horseId", horseController.update);
router.delete("/:horseId", horseController.remove);
router.get("/:horseId/feedings", feedingController.list);
router.post("/:horseId/feedings", feedingController.create);
router.get("/:horseId/weights", weightController.list);
router.post("/:horseId/weights", weightController.create);
router.get("/:horseId/care-records", careController.listRecords);
router.post("/:horseId/care-records", careController.createRecord);
router.get("/:horseId/reproduction-records", reproductionController.list);
router.post("/:horseId/reproduction-records", reproductionController.create);
router.get("/:horseId/timeline", timelineController.list);

export default router;

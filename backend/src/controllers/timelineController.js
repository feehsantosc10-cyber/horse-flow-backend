import * as timelineService from "../services/timelineService.js";

export async function list(req, res, next) {
  try {
    res.json(await timelineService.getHorseTimeline(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

import * as feedingService from "../services/feedingService.js";

export async function list(req, res, next) {
  try {
    res.json(await feedingService.listFeedings(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await feedingService.createFeeding(req.user.companyId, req.params.horseId, req.body));
  } catch (error) {
    next(error);
  }
}

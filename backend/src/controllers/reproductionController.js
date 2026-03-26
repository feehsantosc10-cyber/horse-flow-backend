import * as reproductionService from "../services/reproductionService.js";

export async function list(req, res, next) {
  try {
    res.json(await reproductionService.listReproductionRecords(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await reproductionService.createReproductionRecord(req.user.companyId, req.params.horseId, req.body));
  } catch (error) {
    next(error);
  }
}

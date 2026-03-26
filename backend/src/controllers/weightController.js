import * as weightService from "../services/weightService.js";

export async function list(req, res, next) {
  try {
    res.json(await weightService.listWeights(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await weightService.createWeight(req.user.companyId, req.params.horseId, req.body));
  } catch (error) {
    next(error);
  }
}

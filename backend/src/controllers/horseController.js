import * as horseService from "../services/horseService.js";

export async function list(req, res, next) {
  try {
    res.json(await horseService.listHorses(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await horseService.createHorse(req.user.companyId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    res.json(await horseService.getHorseById(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    res.json(await horseService.updateHorse(req.user.companyId, req.params.horseId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await horseService.deleteHorse(req.user.companyId, req.params.horseId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

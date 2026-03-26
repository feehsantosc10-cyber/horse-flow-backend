import * as careService from "../services/careService.js";

export async function listSettings(req, res, next) {
  try {
    res.json(await careService.listAlertSettings(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export async function updateSetting(req, res, next) {
  try {
    res.json(await careService.updateAlertSetting(req.user.companyId, req.params.careType, req.body));
  } catch (error) {
    next(error);
  }
}

export async function listRecords(req, res, next) {
  try {
    res.json(await careService.listCareRecords(req.user.companyId, req.params.horseId));
  } catch (error) {
    next(error);
  }
}

export async function createRecord(req, res, next) {
  try {
    res.status(201).json(await careService.createCareRecord(req.user.companyId, req.params.horseId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function listAlerts(req, res, next) {
  try {
    res.json(await careService.listAlerts(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

import * as adminService from "../services/adminService.js";

export async function listUsers(req, res, next) {
  try {
    res.json(await adminService.listUsers(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    res.status(201).json(await adminService.createUser(req.user.companyId, req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    res.json(await adminService.updateUser(req.user.companyId, req.params.id, req.body, req.user.userId));
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    res.json(await adminService.updateUserStatus(req.user.companyId, req.params.id, req.body, req.user.userId));
  } catch (error) {
    next(error);
  }
}

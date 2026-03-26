import * as dashboardService from "../services/dashboardService.js";

export async function getDashboard(req, res, next) {
  try {
    res.json(await dashboardService.getDashboard(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

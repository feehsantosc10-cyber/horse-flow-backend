import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    res.status(403).json(await authService.getRegisterDisabledResponse());
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    res.json(await authService.login(req.body));
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    res.json(await authService.getAuthenticatedProfile(req.user.userId));
  } catch (error) {
    next(error);
  }
}

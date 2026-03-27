import { fetchCurrentUser, login } from "./auth.js";

export function loginUser(payload) {
  return login(payload);
}

export function getProfile() {
  return fetchCurrentUser();
}

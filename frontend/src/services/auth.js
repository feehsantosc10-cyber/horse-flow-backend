import { request } from "./api.js";

const TOKEN_KEY = "horseflow-token";
const PROFILE_KEY = "horseflow-profile";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredProfile() {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveAuthSession(session) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export async function login(payload) {
  const session = await request({
    url: "/api/auth/login",
    method: "POST",
    data: payload,
  });

  saveAuthSession(session);
  return session;
}

export async function fetchCurrentUser() {
  return request({
    url: "/api/auth/me",
    method: "GET",
  });
}

export function logout() {
  clearAuthSession();
}

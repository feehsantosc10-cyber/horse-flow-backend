import { request } from "./api.js";

export function listUsers() {
  return request({
    url: "/api/admin/users",
    method: "GET",
  });
}

export function createUser(payload) {
  return request({
    url: "/api/admin/users",
    method: "POST",
    data: payload,
  });
}

export function updateUser(userId, payload) {
  return request({
    url: `/api/admin/users/${userId}`,
    method: "PUT",
    data: payload,
  });
}

export function updateUserStatus(userId, active) {
  return request({
    url: `/api/admin/users/${userId}/status`,
    method: "PATCH",
    data: { active },
  });
}

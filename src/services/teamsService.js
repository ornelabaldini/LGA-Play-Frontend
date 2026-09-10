import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function getTeams() {
  return apiRequest(ENDPOINTS.teams);
}

export function getTeamById(id) {
  return apiRequest(`${ENDPOINTS.teams}/${id}`);
}
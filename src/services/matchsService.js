import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function getMatches() {
  return apiRequest(ENDPOINTS.matchs);
}

export function getMatchById(id) {
  return apiRequest(`${ENDPOINTS.matchs}/${id}`);
}
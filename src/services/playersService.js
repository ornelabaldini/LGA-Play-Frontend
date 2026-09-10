import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function getPlayers() {
  return apiRequest(ENDPOINTS.players);
}

export function getPlayerById(id) {
  return apiRequest(`${ENDPOINTS.players}/${id}`);
}

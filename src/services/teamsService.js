
// Servicio encargado de obtener información de los equipos desde la API.
// Centraliza las consultas relacionadas con los equipos.

import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getTeams() {
  const respuesta = await apiRequest(ENDPOINTS.teams);

  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

export function getTeamById(id) {
  return apiRequest(ENDPOINTS.teamById(id));
}

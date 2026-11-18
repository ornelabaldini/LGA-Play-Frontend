
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

export async function getStandings(temporada) {
  const respuesta = await apiRequest(ENDPOINTS.standings(temporada));

  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

export function getTeamStats(id, temporada) {
  return apiRequest(ENDPOINTS.teamStats(id, temporada));
}

// Obtiene los jugadores de un equipo.
export async function getTeamPlayers(teamId) {
  const respuesta = await apiRequest(ENDPOINTS.teamPlayers(teamId));
  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}
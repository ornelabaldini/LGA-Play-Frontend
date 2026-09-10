import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { getTeams } from "./teamsService";

export function getMatches() {
  return apiRequest(ENDPOINTS.matchs);
}

export function getMatchById(id) {
  return apiRequest(`${ENDPOINTS.matchs}/${id}`);
}

export async function getMatchesWithTeams() {
  const [partidos, equipos] = await Promise.all([
    getMatches(),
    getTeams(),
  ]);

  const nombresPorId = new Map(
    equipos.map((equipo) => [equipo.id_team, equipo.name])
  );

  return partidos.map((partido) => ({
    ...partido,
    teamAName:
      nombresPorId.get(partido.teamA_id) ??
      `Equipo ${partido.teamA_id}`,
    teamBName:
      nombresPorId.get(partido.teamB_id) ??
      `Equipo ${partido.teamB_id}`,
  }));
}
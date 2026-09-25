import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { getTeams } from "./teamsService";

export function getMatches() {
  return apiRequest(ENDPOINTS.matches);
}

export function getMatchById(id) {
  return apiRequest(`${ENDPOINTS.matches}/${id}`);
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
    goalsA: partido._goalsA,
    goalsB: partido._goalsB,
    jugado: partido._jugado,
    scorers: partido._scorers,
    yellow_cards: partido._yellow_cards,
    red_cards: partido._red_cards,
    teamAName:
      nombresPorId.get(partido.teamA_id) ??
      `Equipo ${partido.teamA_id}`,
    teamBName:
      nombresPorId.get(partido.teamB_id) ??
      `Equipo ${partido.teamB_id}`,
  }));
}
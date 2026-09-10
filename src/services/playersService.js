import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { getMatches } from "./matchsService";

export function getPlayers() {
  return apiRequest(ENDPOINTS.players);
}

export function getPlayerById(id) {
  return apiRequest(`${ENDPOINTS.players}/${id}`);
}

export async function getScorers() {
  const [jugadores, partidos] = await Promise.all([
    getPlayers(),
    getMatches(),
  ]);

  const golesPorJugador = new Map();

  partidos
    .filter((partido) => partido.jugado)
    .forEach((partido) => {
      partido.scorers_list.forEach((playerId) => {
        const golesActuales = golesPorJugador.get(playerId) ?? 0;

        golesPorJugador.set(playerId, golesActuales + 1);
      });
    });

  return jugadores
    .map((jugador) => ({
      ...jugador,
      goals: golesPorJugador.get(jugador.id) ?? 0,
    }))
    .sort((a, b) => b.goals - a.goals);
}
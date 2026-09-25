import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function getPlayers() {
  return apiRequest(ENDPOINTS.players);
}

export function getPlayerById(id) {
  return apiRequest(`${ENDPOINTS.players}/${id}`);
}

export async function getScorers(seasonId) {
  const [estadisticas, jugadores] = await Promise.all([
    apiRequest(`${ENDPOINTS.scorers}/${seasonId}/top-scorers`),
    getPlayers(),
  ]);

  const jugadoresPorId = new Map(
    jugadores.map((jugador) => [jugador.id, jugador])
  );

  return estadisticas.map((estadistica) => {
    const jugador = jugadoresPorId.get(estadistica.player_id);

    return {
      id: estadistica.player_id,
      name: jugador?.name || `Jugador ${estadistica.player_id}`,
      position: jugador?.position || "",
      goals: estadistica.goals,
      yellow_cards: estadistica.yellow_cards,
      red_cards: estadistica.red_cards,
    };
  });
}

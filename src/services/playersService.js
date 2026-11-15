
import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

// Obtiene todos los jugadores registrados en el backend.
export async function getPlayers() {
  const respuesta = await apiRequest(ENDPOINTS.players);

  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

// Obtiene un jugador específico por su ID.
export function getPlayerById(id) {
  return apiRequest(ENDPOINTS.playerById(id));
}

// Obtiene los goleadores de una temporada.
export async function getScorers(seasonId) {
  const [estadisticas, jugadores] = await Promise.all([
    apiRequest(ENDPOINTS.topScorers(seasonId)),
    getPlayers(),
  ]);

  const jugadoresPorId = new Map(
    jugadores.map((jugador) => [jugador.id_person ?? jugador.id, jugador])
  );

  const listaEstadisticas = Array.isArray(estadisticas)
    ? estadisticas
    : estadisticas?.value ?? [];

  return listaEstadisticas.map(([playerId, goals]) => {
    const jugador = jugadoresPorId.get(playerId);

    return {
      id: playerId,
      name: jugador?.name ?? `Jugador ${playerId}`,
      position: jugador?.position ?? "",
      goals,
      yellow_cards: 0,
      red_cards: 0,
    };
  });
}

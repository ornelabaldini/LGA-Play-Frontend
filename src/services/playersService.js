
import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getPlayers() {
  const respuesta = await apiRequest(ENDPOINTS.players);
  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

export function getPlayerById(id) {
  return apiRequest(ENDPOINTS.playerById(id));
}

export async function getScorers(seasonId) {
  const [estadisticas, jugadores] = await Promise.all([
    apiRequest(ENDPOINTS.topScorers(seasonId)),
    getPlayers(),
  ]);

  const jugadoresPorId = new Map(
    jugadores.map((jugador) => [jugador.id_player, jugador])
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

export function createPlayer(datos) {
  return apiRequest(ENDPOINTS.createPlayer, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function updatePlayer(playerId, datos) {
  return apiRequest(ENDPOINTS.updatePlayer(playerId), {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function deletePlayer(playerId) {
  return apiRequest(ENDPOINTS.deletePlayer(playerId), {
    method: "DELETE",
  });
}

export function assignPlayer(teamId, playerId) {
  return apiRequest(ENDPOINTS.assignPlayer(teamId, playerId), {
    method: "POST",
  });
}

export function transferPlayer(playerId, teamId) {
  return apiRequest(ENDPOINTS.transferPlayer(playerId, teamId), {
    method: "PATCH",
  });
}


import { apiRequest } from "../api/apiClient";
import { getTeams } from "./teamsService";

// Obtiene todos los partidos de las 22 fechas.
// El backend no tiene un endpoint general GET /matches,
// por eso consultamos cada fecha por separado.
export async function getMatches() {
  const fechas = await Promise.all(
    Array.from({ length: 22 }, (_, i) =>
      apiRequest(`/matches/matchday/${i + 1}`)
    )
  );

  // El backend devuelve los partidos dentro de la propiedad value.
  return fechas.flatMap((respuesta) =>
    Array.isArray(respuesta) ? respuesta : respuesta?.value ?? []
  );
}

// Obtiene un partido específico por su ID.
export function getMatchById(id) {
  return apiRequest(`/matches/${id}`);
}

// Obtiene los partidos y los equipos para mostrar sus nombres.
// También normaliza los datos del partido para que los componentes
// puedan utilizar siempre las mismas propiedades.
export async function getMatchesWithTeams() {
  const [partidos, equipos] = await Promise.all([
    getMatches(),
    getTeams(),
  ]);

  // Relacionamos el ID de cada equipo con su nombre.
  const nombresPorId = new Map(
    equipos.map((equipo) => [equipo.id_team, equipo.name])
  );

  // Agregamos los nombres y normalizamos las propiedades.
  // El backend puede devolver los atributos internos con guion bajo.
  return partidos.map((partido) => ({
    ...partido,
    goalsA: partido.goalsA ?? partido._goalsA ?? 0,
    goalsB: partido.goalsB ?? partido._goalsB ?? 0,
    jugado: partido.jugado ?? partido._jugado ?? false,
    scorers: partido.scorers ?? partido._scorers ?? [],
    yellow_cards: partido.yellow_cards ?? partido._yellow_cards ?? [],
    red_cards: partido.red_cards ?? partido._red_cards ?? [],
    teamAName:
      nombresPorId.get(partido.teamA_id) ?? `Equipo ${partido.teamA_id}`,
    teamBName:
      nombresPorId.get(partido.teamB_id) ?? `Equipo ${partido.teamB_id}`,
  }));
}

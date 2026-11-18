import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

// Obtiene todos los entrenadores.
export async function getCoaches() {
  const respuesta = await apiRequest(ENDPOINTS.coaches);
  return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

// Obtiene el equipo actual de un entrenador.
export function getCoachTeam(coachId) {
  return apiRequest(ENDPOINTS.coachTeam(coachId));
}

// Busca el entrenador asignado a un equipo.
export async function getCoachByTeam(teamId) {
  const entrenadores = await getCoaches();

  const entrenadoresConEquipo = await Promise.all(
    entrenadores.map(async (entrenador) => {
      const equipo = await getCoachTeam(entrenador.id_coach);
      return { entrenador, equipo };
    })
  );

  const asignacion = entrenadoresConEquipo.find(
    ({ equipo }) => Number(equipo?.id_team) === Number(teamId)
  );

  return asignacion?.entrenador ?? null;
}

// Crea un entrenador.
export function createCoach(datos) {
  return apiRequest(ENDPOINTS.createCoach, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

// Edita el nombre de un entrenador.
export function updateCoach(coachId, datos) {
  return apiRequest(ENDPOINTS.updateCoach(coachId), {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

// Elimina un entrenador.
export function deleteCoach(coachId) {
  return apiRequest(ENDPOINTS.deleteCoach(coachId), {
    method: "DELETE",
  });
}

// Transfiere un entrenador a otro equipo.
export function transferCoach(coachId, teamId) {
  return apiRequest(ENDPOINTS.transferCoach(coachId, teamId), {
    method: "PATCH",
  });
}
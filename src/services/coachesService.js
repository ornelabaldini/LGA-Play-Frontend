
import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export async function getCoaches() {
    const respuesta = await apiRequest(ENDPOINTS.coaches);
    return Array.isArray(respuesta) ? respuesta : respuesta?.value ?? [];
}

export function getCoachTeam(coachId) {
    return apiRequest(ENDPOINTS.coachTeam(coachId));
}

export async function getCoachByTeam(teamId) {
    const respuesta = await apiRequest(ENDPOINTS.teamCoaches(teamId));

    const entrenadores = Array.isArray(respuesta)
        ? respuesta
        : respuesta?.value ?? [];

    return entrenadores[0] ?? null;
}

export function createCoach(datos) {
    return apiRequest(ENDPOINTS.createCoach, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export function updateCoach(coachId, datos) {
    const parametros = new URLSearchParams({
        name: datos.name,
    }).toString();

    return apiRequest(
        `${ENDPOINTS.updateCoach(coachId)}?${parametros}`,
        { method: "PATCH" }
    );
}

export function deleteCoach(coachId) {
    return apiRequest(ENDPOINTS.deleteCoach(coachId), {
        method: "DELETE",
    });
}

export function assignCoach(teamId, coachId) {
    return apiRequest(ENDPOINTS.assignCoach(teamId, coachId), {
        method: "POST",
    });
}

export function transferCoach(coachId, teamId) {
    return apiRequest(ENDPOINTS.transferCoach(coachId, teamId), {
        method: "PATCH",
    });
}

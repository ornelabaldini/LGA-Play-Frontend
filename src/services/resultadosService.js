import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function actualizarResultado(idMatch, resultado) {
  return apiRequest(`${ENDPOINTS.matchs}/${idMatch}/result`, {
    method: "PATCH",
    body: JSON.stringify(resultado),
  });
}

import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function actualizarResultado(resultado) {
  return apiRequest(ENDPOINTS.actualizarResultado, {
    method: "PUT",
    body: JSON.stringify(resultado),
  });
}
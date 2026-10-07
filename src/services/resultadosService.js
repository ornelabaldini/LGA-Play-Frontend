// Servicio encargado de actualizar el resultado de un partido.
// Envía una petición PATCH al backend con el nuevo resultado.

import { apiRequest } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export function actualizarResultado(idMatch, resultado) {
  return apiRequest(`${ENDPOINTS.matches}/${idMatch}/result`, {
    method: "PATCH",
    body: JSON.stringify(resultado),
  });
}


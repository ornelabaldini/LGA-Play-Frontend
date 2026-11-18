
// Centraliza las peticiones al backend.
// Configura la URL base, administra el token JWT,
// agrega la autorización y controla los errores de las respuestas.

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Clave utilizada para guardar el token de autenticación.
const TOKEN_KEY = "lga_access_token";

// Guarda el token recibido al iniciar sesión.
export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Elimina el token al cerrar sesión.
export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Realiza las solicitudes HTTP al backend.
export async function apiRequest(endpoint, options = {}) {
  // Recupera el token almacenado, si existe.
  const token = localStorage.getItem(TOKEN_KEY);

  // Configura los encabezados de la solicitud.
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Si hay un usuario autenticado, envía su token JWT.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Ejecuta la solicitud al endpoint correspondiente.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Intenta obtener la respuesta en formato JSON.
  const data = await response.json().catch(() => null);

  // Controla los errores devueltos por el backend.
  if (!response.ok) {
    if (response.status === 401 && token) {
      eliminarToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw new Error(
      data?.detail || `Error ${response.status}: ${response.statusText}`
    );
  }

  return data;
}

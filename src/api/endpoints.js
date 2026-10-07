// Objeto que centraliza las rutas de la API.
// Cada propiedad representa un endpoint del backend que luego utilizan los servicios
// para construir las solicitudes y obtener los datos correspondientes.

export const ENDPOINTS = {
  teams: "/teams",
  players: "/players",
  matches: "/matches",
  scorers: "/season_stats/season"
};

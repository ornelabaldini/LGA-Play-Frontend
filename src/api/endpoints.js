// Objeto que centraliza las rutas de la API.
// Cada propiedad representa un endpoint del backend que luego utilizan los servicios
// para construir las solicitudes y obtener los datos correspondientes.

export const ENDPOINTS = {
  teams: "/teams",
  players: "/players",
  matches: "/matches",
  auth: {
    login: "/auth/login",
  },
  matchday: (number) => `/matches/matchday/${number}`,
  matchById: (id) => `/matches/${id}`,
  topScorers: (seasonId) => `/matches/season/${seasonId}/top-scorers`,
  playerById: (id) => `/players/${id}`,
  teamById: (id) => `/teams/${id}`,
  updateMatchResult: (idMatch) => `/matches/${idMatch}/result`,
};
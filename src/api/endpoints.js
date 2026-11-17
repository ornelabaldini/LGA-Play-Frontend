
export const ENDPOINTS = {
  teams: "/teams",
  players: "/players",
  matches: "/matches",

  auth: {
    login: "/auth/login",
  },

  // Matches
  matchday: (number, season) => `/matches/matchday/${number}?season=${season}`,
  matchById: (id) => `/matches/${id}`,
  topScorers: (seasonId) => `/matches/season/${seasonId}/top-scorers`,
  standings: (season) => `/matches/standings/${season}`,
  qualified: (season) => `/matches/qualified/${season}`,
  nextMatches: (season) => `/matches/next?season=${season}`,
  playoffs: "/matches/playoffs",
  playoffsByGroup: (season, phase, bracketGroup) =>
    `/matches/playoffs/${season}/${phase}/${bracketGroup}`,
  updateMatchResult: (idMatch) => `/matches/${idMatch}/result`,

  // Players
  playerById: (id) => `/players/${id}`,
  playerStats: (id, season) =>
    `/players/${id}/stats${season ? `?season=${season}` : ""}`,

  // Teams
  teamById: (id) => `/teams/${id}`,
  teamStats: (id, season) => `/teams/${id}/stats?season=${season}`,
};

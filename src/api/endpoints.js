
export const ENDPOINTS = {
  teams: "/teams",
  players: "/players",
  coaches: "/coaches",
  matches: "/matches",

  auth: {
    login: "/auth/login",
    me: "/users/me",
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
  createMatch: "/matches",
  createPlayoff: "/matches/playoffs",
  playoffPenalties: (matchId) =>
    `/matches/playoffs/${matchId}/penalties`,

  // Players
  playerById: (id) => `/players/${id}`,
  playerStats: (id, season) =>
    `/players/${id}/stats${season ? `?season=${season}` : ""}`,
  playerTeam: (playerId) => `/players/${playerId}/team`,
  createPlayer: "/players",
  updatePlayer: (playerId) => `/players/${playerId}`,
  deletePlayer: (playerId) => `/players/${playerId}`,
  transferPlayer: (playerId, teamId) =>
    `/players/${playerId}/teams/${teamId}`,

  // Teams
  teamById: (id) => `/teams/${id}`,
  teamStats: (id, season) => `/teams/${id}/stats?season=${season}`,
  teamPlayers: (teamId) => `/teams/${teamId}/players`,
  teamCoaches: (teamId) => `/teams/${teamId}/coaches`,
  createTeam: "/teams",
  updateTeam: (teamId) => `/teams/${teamId}`,
  deleteTeam: (teamId) => `/teams/${teamId}`,
  assignPlayer: (teamId, playerId) =>
    `/teams/${teamId}/players/${playerId}`,
  assignCoach: (teamId, coachId) =>
    `/teams/${teamId}/coaches/${coachId}`,

  // Coaches
  coachTeam: (coachId) => `/coaches/${coachId}/team`,
  createCoach: "/coaches",
  updateCoach: (coachId) => `/coaches/${coachId}`,
  deleteCoach: (coachId) => `/coaches/${coachId}`,
  transferCoach: (coachId, teamId) =>
    `/coaches/${coachId}/teams/${teamId}`,
};

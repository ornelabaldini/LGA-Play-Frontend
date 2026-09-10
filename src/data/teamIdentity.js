const DEFAULT_IDENTITY = {
  primary: "#15803d",
  secondary: "#22c55e",
  pattern: "solid",
};

const TEAM_IDENTITIES = {
  1: {
    primary: "#ffffff",
    secondary: "#2563eb",
    pattern: "horizontal",
  },

  11: {
    primary: "#15803d",
    secondary: "#ffffff",
    pattern: "vertical",
  },
};

export function getTeamIdentity(teamId) {
  return TEAM_IDENTITIES[teamId] ?? DEFAULT_IDENTITY;
}
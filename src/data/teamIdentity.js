const DEFAULT_IDENTITY = {
  primary: "#15803d",
  secondary: "#22c55e",
  pattern: "solid",
};

const TEAM_IDENTITIES = {
  // 1 - Defensores
  1: {
    primary: "#2563eb",
    secondary: "#ffffff",
    pattern: "horizontal",
  },

  // 2 - Juventud Unida
  2: {
    primary: "#dc2626",
    secondary: "#111827",
    pattern: "vertical",
  },

  // 3 - Amigos Unidos
  3: {
    primary: "#2563eb",
    secondary: "#dc2626",
    pattern: "vertical",
  },

  // 4 - Quilmes
  4: {
    primary: "#ffffff",
    secondary: "#2563eb",
    pattern: "horizontal",
  },

  // 5 - Polvorín
  5: {
    primary: "#dc2626",
    secondary: "#ffffff",
    pattern: "vertical",
  },

  // 6 - Los Santos
  6: {
    primary: "#111827",
    secondary: "#ffffff",
    pattern: "horizontal",
  },

  // 7 - San Martín
  7: {
    primary: "#ffffff",
    secondary: "#2563eb",
    pattern: "horizontal",
  },

  // 8 - Once Unidos
  8: {
    primary: "#2563eb",
    secondary: "#ffffff",
    pattern: "vertical",
  },

  // 9 - Huracanes
  9: {
    primary: "#dc2626",
    secondary: "#111827",
    pattern: "vertical",
  },

  // 10 - Defensores DS
  10: {
    primary: "#2563eb",
    secondary: "#ffffff",
    pattern: "horizontal",
  },

  // 11 - Sudamérica
  11: {
    primary: "#15803d",
    secondary: "#ffffff",
    pattern: "vertical",
  },

  // 12 - Atlético
  12: {
    primary: "#dc2626",
    secondary: "#ffffff",
    pattern: "vertical",
  },
};

export function getTeamIdentity(teamId) {
  return TEAM_IDENTITIES[teamId] ?? DEFAULT_IDENTITY;
}
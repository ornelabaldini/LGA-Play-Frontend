
const TEAM_IDENTITIES = {
  1: "/escudos/defensores.png",
  2: "/escudos/juventudunida.png",
  3: "/escudos/amigosunidos.png",
  4: "/escudos/quilmes.png",
  5: "/escudos/polvorin.png",
  6: "/escudos/lossantos.png",
  7: "/escudos/sanmartin.png",
  8: "/escudos/onceunidos.png",
  9: "/escudos/huracanes.png",
  10: "/escudos/defensoresds.png",
  11: "/escudos/sudamerica.png",
  12: "/escudos/atletico.png",
};

export function getTeamIdentity(teamId) {
  return TEAM_IDENTITIES[teamId] ?? null;
}

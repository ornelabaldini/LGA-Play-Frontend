
const TEAM_IDENTITIES = {
  1: "https://www.futbolinterior.com.ar/images/stories/clubes/41defe.gif",
  2: "https://www.futbolinterior.com.ar/images/stories/04-2026/1775314723_69d12723db611.png",
  3: "/escudos/amigosunidos.jpg",
  4: "/escudos/quilmes.jpg",
  5: "/escudos/polvorin.jpg",
  6: "/escudos/lossantos.jpg",
  7: "/escudos/sanmartin.jpg",
  8: "/escudos/onceunidos.jpg",
  9: "/escudos/huracanes.jpg",
  10: "https://www.futbolinterior.com.ar/images/stories/clubes/41DefensoresSur.gif",
  11: "https://www.futbolinterior.com.ar/images/stories/clubes/41sud.gif",
  12: "/escudos/atletico.jpg",
};

export function getTeamIdentity(teamId) {
  return TEAM_IDENTITIES[teamId] ?? null;
}


const TEAM_IDENTITIES = {
  1: "https://www.futbolinterior.com.ar/images/stories/clubes/41defe.gif",
  2: "https://www.futbolinterior.com.ar/images/stories/04-2026/1775314723_69d12723db611.png",
  3: "https://www.futbolinterior.com.ar/images/stories/04-2026/1775314681_69d126f9ec8f9.png",
  4: "https://www.futbolinterior.com.ar/images/stories/04-2026/1775314758_69d127460e2c7.png",
  5: "https://www.futbolinterior.com.ar/images/stories/clubes/41elpolvorin.gif",
  6: "https://www.futbolinterior.com.ar/images/stories/clubes/41SantosdelOeste.gif",
  7: "https://www.futbolinterior.com.ar/images/stories/clubes/1003sanmartin.gif",
  8: "https://www.futbolinterior.com.ar/images/stories/clubes/41once.gif",
  9:  "/escudos/huracanes.jpg",
  10: "https://www.futbolinterior.com.ar/images/stories/clubes/41DefensoresSur.gif",
  11: "https://www.futbolinterior.com.ar/images/stories/clubes/41sud.gif",
  12: "https://www.futbolinterior.com.ar/images/stories/clubes/41atletico.gif",
};

export function getTeamIdentity(teamId) {
  return TEAM_IDENTITIES[teamId] ?? null;
}

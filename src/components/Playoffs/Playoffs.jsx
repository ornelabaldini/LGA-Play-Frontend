import { useEffect, useState } from "react";
import { getTeams } from "../../services/teamsService";
import "./Playoffs.css";

function ordenarEquipos(equipos) {
  return [...equipos].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    return b.wins - a.wins;
  });
}

function Partido({ equipoA, equipoB }) {
  return (
    <div className="llave-partido">
      <div className="llave-equipo">
        <span>{equipoA}</span>
        <strong>-</strong>
      </div>

      <div className="llave-equipo">
        <span>{equipoB}</span>
        <strong>-</strong>
      </div>
    </div>
  );
}

function Playoffs() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getTeams()
      .then((data) => {
        const ordenados = ordenarEquipos(data);

        // 16 equipos para:
        // Primera ronda → Cuartos → Semifinal → Final
        setEquipos(ordenados.slice(0, 16));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p>Cargando playoffs...</p>;
  }

  const nombres = equipos.map((equipo) => equipo.name);

  // Completar lugares si todavía no hay 16 equipos
  while (nombres.length < 16) {
    nombres.push("Por definir");
  }

  /*
   * =========================
   * PRIMERA RONDA
   * =========================
   *
   * 16 equipos
   * 8 partidos
   */

  const primeraRonda = [
    [nombres[0], nombres[15]],
    [nombres[7], nombres[8]],
    [nombres[3], nombres[12]],
    [nombres[4], nombres[11]],
    [nombres[1], nombres[14]],
    [nombres[6], nombres[9]],
    [nombres[2], nombres[13]],
    [nombres[5], nombres[10]],
  ];

  /*
   * =========================
   * CUARTOS
   * =========================
   *
   * 8 ganadores
   * 4 partidos
   */

  const cuartos = [
    ["Ganador 1", "Ganador 2"],
    ["Ganador 3", "Ganador 4"],
    ["Ganador 5", "Ganador 6"],
    ["Ganador 7", "Ganador 8"],
  ];

  /*
   * =========================
   * SEMIFINALES
   * =========================
   *
   * 4 ganadores
   * 2 partidos
   */

  const semifinal = [
    ["Ganador Cuartos 1", "Ganador Cuartos 2"],
    ["Ganador Cuartos 3", "Ganador Cuartos 4"],
  ];

  /*
   * =========================
   * FINAL
   * =========================
   *
   * 2 ganadores
   * 1 partido
   */

  const final = [
    ["Ganador Semifinal 1", "Ganador Semifinal 2"],
  ];

  return (
    <section className="playoffs">

      <div className="playoffs__encabezado">
        <div>
          <p>El camino hacia la Final&iacute;sima</p>
        </div>

        <span className="playoffs__badge">16 equipos</span>
      </div>


      <div className="playoffs__cuadro">

        {/* =========================
            PRIMERA RONDA
            16 → 8
            ========================= */}

        <div className="playoffs__ronda ronda-primera">
          <h3>Primera ronda</h3>

          <div className="ronda__partidos">
            {primeraRonda.map((partido, index) => (
              <Partido
                key={index}
                equipoA={partido[0]}
                equipoB={partido[1]}
              />
            ))}
          </div>
        </div>


        {/* =========================
            CUARTOS
            8 → 4
            ========================= */}

        <div className="playoffs__ronda ronda-cuartos">
          <h3>Cuartos</h3>

          <div className="ronda__partidos">
            {cuartos.map((partido, index) => (
              <Partido
                key={index}
                equipoA={partido[0]}
                equipoB={partido[1]}
              />
            ))}
          </div>
        </div>


        {/* =========================
            SEMIFINALES
            4 → 2
            ========================= */}

        <div className="playoffs__ronda ronda-semifinal">
          <h3>Semifinal</h3>

          <div className="ronda__partidos">
            {semifinal.map((partido, index) => (
              <Partido
                key={index}
                equipoA={partido[0]}
                equipoB={partido[1]}
              />
            ))}
          </div>
        </div>


        {/* =========================
            FINAL
            2 → 1
            ========================= */}

        <div className="playoffs__ronda ronda-final">
          <h3>Final</h3>

          <div className="ronda__partidos">
            {final.map((partido, index) => (
              <Partido
                key={index}
                equipoA={partido[0]}
                equipoB={partido[1]}
              />
            ))}
          </div>

          {/* =========================
              CAMPEÓN
              ========================= */}

          <div className="playoffs__campeon">
            <span>🏆</span>
            <strong>Campeón </strong>
            <span> Por definir</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Playoffs;



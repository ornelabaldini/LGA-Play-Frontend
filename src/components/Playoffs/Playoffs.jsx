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
        setEquipos(ordenados.slice(1, 9));
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

  while (nombres.length < 8) {
    nombres.push("Por definir");
  }

  const primeraRonda = [
    [nombres[0], nombres[7]],
    [nombres[3], nombres[4]],
    [nombres[1], nombres[6]],
    [nombres[2], nombres[5]],
  ];

  const cuartos = [
    ["Ganador", "Ganador"],
    ["Ganador", "Ganador"],
  ];

  const semifinal = [
    ["Ganador", "Ganador"],
  ];

  const final = [
    ["Ganador", "Ganador"],
  ];

  return (
    <section className="playoffs">
      <div className="playoffs__encabezado">
        <div>
          <p>El camino hacia la Final&iacute;sima</p>
        </div>

        <span className="playoffs__badge">8 equipos</span>
      </div>

      <div className="playoffs__cuadro">

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
        </div>

      </div>
    </section>
  );
}

export default Playoffs;
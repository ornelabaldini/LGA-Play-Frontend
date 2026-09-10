import { useEffect, useState } from "react";
import { getTeams } from "../../services/teamsService";
import "./Hero.css";

function Hero() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getTeams()
      .then((data) => {
        const topTres = [...data]
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.goalDifference - a.goalDifference;
          })
          .slice(0, 3);

        setEquipos(topTres);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="resumen-cargando">Cargando posiciones...</p>;
  }

  return (
    <section className="hero">
      <h2>🏆 Podio</h2>

      <div className="podio">
        {equipos.map((equipo, index) => (
          <article className="podio-equipo" key={equipo.id_team}>
            <span className="podio-puesto">{index + 1}°</span>

            <strong>{equipo.name}</strong>

            <span className="podio-puntos">
              {equipo.points} pts
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Hero;
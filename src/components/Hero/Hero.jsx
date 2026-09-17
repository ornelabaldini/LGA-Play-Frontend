import { useEffect, useState } from "react";
import { getTeams } from "../../services/teamsService";
import "./Hero.css";

function ordenarEquipos(equipos) {
  return [...equipos].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    return b.wins - a.wins;
  });
}

function Hero() {
  const [primerPuesto, setPrimerPuesto] = useState(null);

  useEffect(() => {
    getTeams()
      .then((data) => {
        const equiposOrdenados = ordenarEquipos(data);
        setPrimerPuesto(equiposOrdenados[0] ?? null);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <section className="hero">
      <h2>⚔️ Finalísima</h2>

      <div className="finalisima">
        <article className="finalisima__equipo">
          <span>1.º puesto</span>
          <strong>
            {primerPuesto ? primerPuesto.name : "Cargando..."}
          </strong>
        </article>

        <article className="finalisima__equipo">
          <span>Playoffs</span>
          <strong>Por definir</strong>
        </article>
      </div>
    </section>
  );
}

export default Hero;

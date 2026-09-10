import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeamById } from "../../services/teamsService";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import Panel from "../Panel/Panel";
import "./EquipoDetalle.css";

function EquipoDetalle() {
  const { teamId } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeamById(teamId)
      .then((data) => {
        setEquipo(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [teamId]);

  if (cargando) {
    return <main className="contenido">Cargando equipo...</main>;
  }

  if (error) {
    return <main className="contenido">Error: {error}</main>;
  }

  const partidosJugados =
    equipo.wins + equipo.draws + equipo.losses;

  return (
    <main className="contenido">
      <Link to="/" className="volver">
        ← Volver a posiciones
      </Link>

      <Panel titulo="Ficha del equipo">
        <section className="equipo-detalle">
          <header className="equipo-detalle__encabezado">
            <IdentidadEquipo
              teamId={equipo.id_team}
              teamName={equipo.name}
            />

            <div>
              <h3>{equipo.name}</h3>
              <p>Posición actual del campeonato</p>
            </div>

            <strong>{equipo.points} pts</strong>
          </header>

          <div className="equipo-detalle__estadisticas">
            <span><small>PJ</small>{partidosJugados}</span>
            <span><small>PG</small>{equipo.wins}</span>
            <span><small>PE</small>{equipo.draws}</span>
            <span><small>PP</small>{equipo.losses}</span>
            <span><small>DG</small>{equipo.goalDifference}</span>
          </div>
        </section>
      </Panel>
    </main>
  );
}

export default EquipoDetalle;
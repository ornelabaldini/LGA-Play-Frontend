
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getTeamById,
  getTeamStats,
} from "../../services/teamsService";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import Panel from "../Panel/Panel";
import "./EquipoDetalle.css";

function EquipoDetalle() {
  const { teamId } = useParams();
  const [searchParams] = useSearchParams();
  const temporada =
    Number(searchParams.get("season")) || new Date().getFullYear();

  const [equipo, setEquipo] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    Promise.all([
      getTeamById(teamId),
      getTeamStats(teamId, temporada),
    ])
      .then(([datosEquipo, datosEstadisticas]) => {
        setEquipo(datosEquipo);
        setEstadisticas(datosEstadisticas);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [teamId, temporada]);

  if (cargando) {
    return <main className="contenido">Cargando equipo...</main>;
  }

  if (error) {
    return <main className="contenido">Error: {error}</main>;
  }

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
              <p>
                Posición {estadisticas.position} · Temporada {temporada}
              </p>
            </div>

            <span>
              <small>DG</small>
              {estadisticas.goal_difference}
            </span>
          </header>

          <div className="equipo-detalle__estadisticas">
            <span><small>PJ</small>{estadisticas.played}</span>
            <span><small>PG</small>{estadisticas.wins}</span>
            <span><small>PE</small>{estadisticas.draws}</span>
            <span><small>PP</small>{estadisticas.losses}</span>
            <span><small>DG</small>{estadisticas.goal_difference}</span>
          </div>
        </section>
      </Panel>
    </main>
  );
}

export default EquipoDetalle;

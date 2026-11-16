//Pide los equipos al backend, los ordena según 
// la tabla de posiciones y después los muestra 
// en una tabla para PC y en tarjetas para móvil.

import { useEffect, useState } from "react";
import "./TablaPosiciones.css";
import { getStandings } from "../../services/teamsService";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import { Link } from "react-router-dom";

function ordenarEquipos(equipos) {
  return [...equipos].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.goal_difference !== a.goal_difference) {
      return b.goal_difference - a.goal_difference;
    }

    return b.wins - a.wins;
  });
}

function TablaPosiciones({ temporada }) {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);

    getStandings(temporada)
      .then((data) => {
        setEquipos(ordenarEquipos(data));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [temporada]);

  if (cargando) {
    return <p>Cargando equipos...</p>;
  }

  if (error) {
    return <p>Error al cargar los equipos: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <table className="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PTS</th>
            <th>DG</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
          </tr>
        </thead>

        <tbody>
          {equipos.map((equipo, index) => (
            <tr key={equipo.id_team}>
              <td>{index + 1}</td>
              <td>
                <Link
                  to={`/equipos/${equipo.id_team}`}
                  className="equipo-enlace"
                >
                  <IdentidadEquipo
                    teamId={equipo.id_team}
                    teamName={equipo.name}
                  />
                  <span className="nombre-equipo">{equipo.name}</span>
                </Link>
              </td>
              <td className="puntos">{equipo.points}</td>
              <td>{equipo.goal_difference}</td>
              <td>{equipo.played}</td>
              <td>{equipo.wins}</td>
              <td>{equipo.draws}</td>
              <td>{equipo.losses}</td>
              <td>{equipo.gf}</td>
              <td>{equipo.ga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPosiciones;
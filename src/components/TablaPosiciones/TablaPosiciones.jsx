//Pide los equipos al backend, los ordena según 
// la tabla de posiciones y después los muestra 
// en una tabla para PC y en tarjetas para móvil.

import { useEffect, useState } from "react";
import "./TablaPosiciones.css";
import { getTeams } from "../../services/teamsService";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import { Link } from "react-router-dom";

function ordenarEquipos(equipos) {
  return [...equipos].sort((a, b) => {
    if (b._points !== a._points) {
      return b._points - a._points;
    }

    if (b._goalDifference !== a._goalDifference) {
      return b._goalDifference - a._goalDifference;
    }

    return b.wins - a.wins;
  });
}

function TablaPosiciones() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeams()
      .then((data) => {
        console.log(data);

        setEquipos(ordenarEquipos(data));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

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
              <td className="puntos">{equipo._points}</td>
              <td>{equipo._goalDifference}</td>
              <td>{equipo.wins + equipo.draws + equipo.losses}</td>
              <td>{equipo.wins}</td>
              <td>{equipo.draws}</td>
              <td>{equipo.losses}</td>
              <td>0</td>
              <td>0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPosiciones;
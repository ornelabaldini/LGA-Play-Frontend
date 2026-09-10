import { useEffect, useState } from "react";
import "./TablaPosiciones.css";
import { getTeams } from "../../services/teamsService";

function TablaPosiciones() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeams()
      .then((data) => {
        setEquipos(data);
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
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>PTS</th>
          </tr>
        </thead>

        <tbody>
          {equipos.map((equipo, index) => (
            <tr key={equipo.id_team}>
              <td>{index + 1}</td>
              <td>{equipo.name}</td>
              <td>
                {equipo.wins + equipo.draws + equipo.losses}
              </td>
              <td>{equipo.wins}</td>
              <td>{equipo.draws}</td>
              <td>{equipo.losses}</td>
              <td>0</td>
              <td>0</td>
              <td>{equipo.goalDifference}</td>
              <td>{equipo.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPosiciones;
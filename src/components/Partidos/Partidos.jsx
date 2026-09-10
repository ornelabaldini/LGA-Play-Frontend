import { useEffect, useState } from "react";
import { getMatches } from "../../services/matchsService";
import "./Partidos.css";

function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMatches()
      .then((data) => {
        setPartidos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p>Cargando partidos...</p>;
  }

  if (error) {
    return <p>Error al cargar los partidos: {error}</p>;
  }

  return (
    <div className="partidos">
      {partidos.map((partido) => (
        <article className="partido" key={partido.id_match}>
          <span>Fecha {partido.matchday}</span>

          <div>
            <strong>Equipo {partido.teamA_id}</strong>

            <span>
              {partido.goalsA} - {partido.goalsB}
            </span>

            <strong>Equipo {partido.teamB_id}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Partidos;
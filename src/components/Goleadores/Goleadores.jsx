import { useEffect, useState } from "react";
import "./Goleadores.css";
import { getScorers } from "../../services/playersService";

function Goleadores({ temporada }) {
  const [goleadores, setGoleadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    getScorers(temporada)
      .then((data) => setGoleadores(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [temporada]);

  if (cargando) {
    return <p>Cargando goleadores...</p>;
  }

  if (error) {
    return <p>Error al cargar goleadores: {error}</p>;
  }

  if (goleadores.length === 0) {
    return <p>No hay goleadores registrados.</p>;
  }

  const lider = goleadores[0];

  return (
    <div className="goleadores">
      <section className="botin-oro">
        <span>👟</span>

        <div>
          <p>Botín de Oro provisional</p>
          <strong>{lider.name}</strong>
        </div>

        <b>{lider.goals} goles</b>
      </section>

      <div className="tabla-goleadores">
        {goleadores.map((jugador, index) => (
          <article
            key={jugador.id}
            className="fila-goleador"
          >
            <span>{index + 1}°</span>
            <strong>{jugador.name}</strong>
            <span>{jugador.position}</span>
            <b>{jugador.goals} goles</b>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Goleadores;
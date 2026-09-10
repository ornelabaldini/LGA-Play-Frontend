import { useEffect, useState } from "react";
import { getScorers } from "../../services/playersService";
import "./Goleadores.css";

function Goleadores() {
  const [goleadores, setGoleadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getScorers()
      .then((data) => {
        setGoleadores(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p>Cargando goleadores...</p>;
  }

  if (error) {
    return <p>Error al cargar los goleadores: {error}</p>;
  }

  const lider = goleadores[0];

  if (!lider || lider.goals === 0) {
    return <p>Aún no hay goles cargados en el campeonato.</p>;
  }

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
          <article key={jugador.id} className="fila-goleador">
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
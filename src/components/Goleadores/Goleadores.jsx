import { useEffect, useState } from "react";
import "./Goleadores.css";
import { goleadoresPrueba } from "../../data/goleadoresMock";

function Goleadores() {
  const [goleadores, setGoleadores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGoleadores(goleadoresPrueba);
      setCargando(false);
    }, 300);
  }, []);

  if (cargando) {
    return <p>Cargando goleadores...</p>;
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

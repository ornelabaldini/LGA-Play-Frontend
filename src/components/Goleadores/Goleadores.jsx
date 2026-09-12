import { useEffect, useState } from "react";
import "./Goleadores.css";

const goleadoresPrueba = [
  {
    id: 1,
    name: "Jugador A",
    position: "Delantero",
    goals: 8,
  },
  {
    id: 2,
    name: "Jugador B",
    position: "Delantero",
    goals: 6,
  },
  {
    id: 3,
    name: "Jugador C",
    position: "Mediocampista",
    goals: 4,
  },
  {
    id: 4,
    name: "Jugador D",
    position: "Delantero",
    goals: 3,
  },
];

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

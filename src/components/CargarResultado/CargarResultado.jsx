import { useEffect, useState } from "react";
import "./CargarResultado.css";

import { getMatchesWithTeams } from "../../services/matchsService";
import { getPlayers } from "../../services/playersService";
import { actualizarResultado } from "../../services/resultadosService";

function CargarResultado() {
  const [partidos, setPartidos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [resultados, setResultados] = useState({});

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [partidosData, jugadoresData] = await Promise.all([
          getMatchesWithTeams(),
          getPlayers(),
        ]);

        setPartidos(partidosData);
        setJugadores(jugadoresData);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  function actualizarCampo(partidoId, campo, valor) {
    setResultados((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: valor,
      },
    }));
  }

  async function guardarResultado(partidoId) {
    const resultado = resultados[partidoId];

    if (!resultado) {
      alert("Completá el resultado.");
      return;
    }

    try {
      await actualizarResultado({
        partidoId,
        golesLocal: Number(resultado.golesLocal || 0),
        golesVisitante: Number(resultado.golesVisitante || 0),
        goleadores: resultado.goleadores || [],
        amarillas: resultado.amarillas || [],
        rojas: resultado.rojas || [],
      });

      alert("Resultado guardado correctamente.");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el resultado.");
    }
  }

  if (cargando) {
    return <p>Cargando partidos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="cargar-resultado">
      <h2>Cargar resultados</h2>

      {partidos.map((partido) => {
        const resultado = resultados[partido.id] || {};

        return (
          <article className="resultado-partido" key={partido.id}>
            <h3>
              {partido.teamAName} vs {partido.teamBName}
            </h3>

            <div className="resultado-goles">
              <label>
                {partido.teamAName}
                <input
                  type="number"
                  min="0"
                  value={resultado.golesLocal || ""}
                  onChange={(e) =>
                    actualizarCampo(
                      partido.id,
                      "golesLocal",
                      e.target.value
                    )
                  }
                />
              </label>

              <span>-</span>

              <label>
                {partido.teamBName}
                <input
                  type="number"
                  min="0"
                  value={resultado.golesVisitante || ""}
                  onChange={(e) =>
                    actualizarCampo(
                      partido.id,
                      "golesVisitante",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <label>
              Goleadores
              <select
                onChange={(e) => {
                  if (!e.target.value) return;

                  actualizarCampo(partido.id, "goleadores", [
                    ...(resultado.goleadores || []),
                    Number(e.target.value),
                  ]);

                  e.target.value = "";
                }}
              >
                <option value="">Seleccionar jugador</option>

                {jugadores.map((jugador) => (
                  <option key={jugador.id} value={jugador.id}>
                    {jugador.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Amarillas
              <select
                onChange={(e) => {
                  if (!e.target.value) return;

                  actualizarCampo(partido.id, "amarillas", [
                    ...(resultado.amarillas || []),
                    Number(e.target.value),
                  ]);

                  e.target.value = "";
                }}
              >
                <option value="">Seleccionar jugador</option>

                {jugadores.map((jugador) => (
                  <option key={jugador.id} value={jugador.id}>
                    {jugador.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Rojas
              <select
                onChange={(e) => {
                  if (!e.target.value) return;

                  actualizarCampo(partido.id, "rojas", [
                    ...(resultado.rojas || []),
                    Number(e.target.value),
                  ]);

                  e.target.value = "";
                }}
              >
                <option value="">Seleccionar jugador</option>

                {jugadores.map((jugador) => (
                  <option key={jugador.id} value={jugador.id}>
                    {jugador.name}
                  </option>
                ))}
              </select>
            </label>

            <button onClick={() => guardarResultado(partido.id)}>
              Guardar resultado
            </button>
          </article>
        );
      })}
    </section>
  );
}

export default CargarResultado;
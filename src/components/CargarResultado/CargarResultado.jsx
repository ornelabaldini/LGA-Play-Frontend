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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(1);

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

  const partidosDeLaFecha = partidos.filter(
    (partido) => partido.matchday === Number(fechaSeleccionada)
  );

  return (
    <section className="cargar-resultado">

      <div className="selector-fecha">
        <label htmlFor="fecha">Fecha</label>

        <select
          id="fecha"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        >
          {Array.from({ length: 22 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Fecha {i + 1}
            </option>
          ))}
        </select>
      </div>

      {partidosDeLaFecha.map((partido) => {
        const resultado = resultados[partido.id_match] || {};

        return (
          <article
            className="resultado-partido"
            key={partido.id_match}
          >
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
                      partido.id_match,
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
                      partido.id_match,
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

                  actualizarCampo(partido.id_match, "goleadores", [
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

                  actualizarCampo(partido.id_match, "amarillas", [
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

                  actualizarCampo(partido.id_match, "rojas", [
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

            <button
              onClick={() => guardarResultado(partido.id_match)}
            >
              Guardar resultado
            </button>
          </article>
        );
      })}
    </section>
  );
}

export default CargarResultado;
import { useEffect, useState } from "react";
import { getMatchesWithTeams } from "../../services/matchsService";
import { getPlayers } from "../../services/playersService";
import { actualizarResultado } from "../../services/resultadosService";
import "./CargarFecha.css";

function CargarFecha() {
  const [partidos, setPartidos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [resultados, setResultados] = useState({});
  const [erroresGuardado, setErroresGuardado] = useState({});
  const [partidosBloqueados, setPartidosBloqueados] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [partidosData, jugadoresData] = await Promise.all([
        getMatchesWithTeams(),
        getPlayers(),
      ]);

      setPartidos(partidosData);
      setJugadores(jugadoresData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  const fechasDisponibles = [
    ...new Set(partidos.map((partido) => partido.matchday)),
  ];

  function actualizarCampo(partidoId, campo, valor) {
    if (partidosBloqueados[partidoId]) return;

    setResultados((prev) => {
      const resultadoActual = prev[partidoId] || {};

      const nuevoResultado = {
        ...resultadoActual,
        [campo]: valor,
      };

      if (campo === "golesLocal") {
        const cantidadGoles = Number(valor || 0);
        const goleadores = resultadoActual.goleadoresLocal || [];
        nuevoResultado.goleadoresLocal = goleadores.slice(0, cantidadGoles);
      }

      if (campo === "golesVisitante") {
        const cantidadGoles = Number(valor || 0);
        const goleadores = resultadoActual.goleadoresVisitante || [];
        nuevoResultado.goleadoresVisitante = goleadores.slice(0, cantidadGoles);
      }

      return {
        ...prev,
        [partidoId]: nuevoResultado,
      };
    });

    setErroresGuardado((prev) => ({
      ...prev,
      [partidoId]: "",
    }));
  }

  function agregarEvento(partidoId, campo, jugadorId) {
    if (!jugadorId) return;
    if (partidosBloqueados[partidoId]) return;

    setResultados((prev) => {
      const resultadoActual = prev[partidoId] || {};
      const eventosActuales = resultadoActual[campo] || [];

      if (
        campo === "goleadoresLocal" ||
        campo === "goleadoresVisitante"
      ) {
        const cantidadMaxima =
          campo === "goleadoresLocal"
            ? Number(resultadoActual.golesLocal || 0)
            : Number(resultadoActual.golesVisitante || 0);

        if (eventosActuales.length >= cantidadMaxima) {
          return prev;
        }
      }

      return {
        ...prev,
        [partidoId]: {
          ...resultadoActual,
          [campo]: [...eventosActuales, Number(jugadorId)],
        },
      };
    });

    setErroresGuardado((prev) => ({
      ...prev,
      [partidoId]: "",
    }));
  }

  function eliminarEvento(partidoId, campo, indice) {
    if (partidosBloqueados[partidoId]) return;

    setResultados((prev) => {
      const resultadoActual = prev[partidoId] || {};
      const eventosActuales = resultadoActual[campo] || [];

      return {
        ...prev,
        [partidoId]: {
          ...resultadoActual,
          [campo]: eventosActuales.filter((_, i) => i !== indice),
        },
      };
    });

    setErroresGuardado((prev) => ({
      ...prev,
      [partidoId]: "",
    }));
  }

  function obtenerNombreJugador(jugadorId) {
    const jugador = jugadores.find(
      (j) => Number(j.id) === Number(jugadorId)
    );

    return jugador?.name || `Jugador ${jugadorId}`;
  }

  function obtenerJugadoresEquipo() {
    return jugadores;
  }

  function contarGoleadores(goleadores) {
    const conteo = {};

    goleadores.forEach((jugadorId) => {
      conteo[jugadorId] = (conteo[jugadorId] || 0) + 1;
    });

    return conteo;
  }

  function modificarPartido(partidoId) {
    setPartidosBloqueados((prev) => ({
      ...prev,
      [partidoId]: false,
    }));
  }

  async function guardarResultado(partido) {
    const partidoId = partido.id_match;

    if (partidosBloqueados[partidoId]) return;

    const resultado = resultados[partidoId] || {};

    const golesLocal = Number(resultado.golesLocal || 0);
    const golesVisitante = Number(resultado.golesVisitante || 0);

    const goleadoresLocal = resultado.goleadoresLocal || [];
    const goleadoresVisitante = resultado.goleadoresVisitante || [];

    if (goleadoresLocal.length !== golesLocal) {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]:
          `El equipo local tiene ${golesLocal} gol(es), pero cargaste ${goleadoresLocal.length} goleador(es).`,
      }));
      return;
    }

    if (goleadoresVisitante.length !== golesVisitante) {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]:
          `El equipo visitante tiene ${golesVisitante} gol(es), pero cargaste ${goleadoresVisitante.length} goleador(es).`,
      }));
      return;
    }

    try {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: "",
      }));

      await actualizarResultado(partidoId, {
        goalsA: golesLocal,
        goalsB: golesVisitante,
        scorers: [
          ...goleadoresLocal,
          ...goleadoresVisitante,
        ],
        yellow_cards: [
          ...(resultado.amarillasLocal || []),
          ...(resultado.amarillasVisitante || []),
        ],
        red_cards: [
          ...(resultado.rojasLocal || []),
          ...(resultado.rojasVisitante || []),
        ],
      });

      setPartidosBloqueados((prev) => ({
        ...prev,
        [partidoId]: true,
      }));

      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: "Resultado guardado correctamente.",
      }));
    } catch (error) {
      console.error("Error guardando resultado:", error);

      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: "No se pudo guardar el resultado.",
      }));
    }
  }

  function renderGoleadores(
    partidoId,
    jugadoresEquipo,
    goleadores,
    campo
  ) {
    const conteo = contarGoleadores(goleadores);
    const resultado = resultados[partidoId] || {};

    const cantidadGoles =
      campo === "goleadoresLocal"
        ? Number(resultado.golesLocal || 0)
        : Number(resultado.golesVisitante || 0);

    const limiteAlcanzado = goleadores.length >= cantidadGoles;
    const bloqueado = partidosBloqueados[partidoId];

    return (
      <>
        <select
          value=""
          disabled={
            bloqueado ||
            cantidadGoles === 0 ||
            limiteAlcanzado
          }
          onChange={(e) =>
            agregarEvento(partidoId, campo, e.target.value)
          }
        >
          <option value="">
            {cantidadGoles === 0
              ? "Primero cargá los goles"
              : limiteAlcanzado
              ? "Máximo de goleadores alcanzado"
              : "Seleccionar goleador"}
          </option>

          {jugadoresEquipo.map((jugador) => (
            <option key={jugador.id} value={jugador.id}>
              {jugador.name}
            </option>
          ))}
        </select>

        <div className="contador-eventos">
          {goleadores.length} / {cantidadGoles}
        </div>

        {goleadores.length > 0 && (
          <div className="eventos-cargados">
            {[...new Set(goleadores)].map((jugadorId) => (
              <div
                className="evento-item"
                key={jugadorId}
              >
                <span>
                  {obtenerNombreJugador(jugadorId)}
                  {conteo[jugadorId] > 1 &&
                    ` (${conteo[jugadorId]})`}
                </span>

                <button
                  type="button"
                  disabled={bloqueado}
                  onClick={() =>
                    eliminarEvento(partidoId, campo, indice)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderTarjetas(
    partidoId,
    jugadoresEquipo,
    eventos,
    campo,
    etiqueta
  ) {
    const bloqueado = partidosBloqueados[partidoId];

    return (
      <>
        <div className="evento-titulo">{etiqueta}</div>

        <select
          value=""
          disabled={bloqueado}
          onChange={(e) =>
            agregarEvento(partidoId, campo, e.target.value)
          }
        >
          <option value="">Seleccionar jugador</option>

          {jugadoresEquipo.map((jugador) => (
            <option key={jugador.id} value={jugador.id}>
              {jugador.name}
            </option>
          ))}
        </select>

        {eventos.length > 0 && (
          <div className="eventos-cargados">
            {eventos.map((jugadorId, indice) => (
              <div
                className="evento-item"
                key={jugadorId}
              >
                <span>{obtenerNombreJugador(jugadorId)}</span>

                <button
                  type="button"
                  disabled={bloqueado}
                  onClick={() =>
                    eliminarEvento(partidoId, campo, indice)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  const partidosFiltrados = fechaSeleccionada
    ? partidos.filter(
        (partido) =>
          String(partido.matchday) === String(fechaSeleccionada)
      )
    : [];

  return (
    <section className="cargar-resultado">
      <div className="selector-fecha">
        <label htmlFor="fecha">Seleccioná una fecha</label>

        <select
          id="fecha"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar fecha</option>

          {fechasDisponibles.map((fecha) => (
            <option key={fecha} value={fecha}>
              Fecha {fecha}
            </option>
          ))}
        </select>
      </div>

      {partidosFiltrados.map((partido) => {
        const resultado = resultados[partido.id_match] || {};
        const jugadoresLocal = obtenerJugadoresEquipo();
        const jugadoresVisitante = obtenerJugadoresEquipo();
        const bloqueado = partidosBloqueados[partido.id_match];

        return (
          <div
            className={`resultado-partido ${
              bloqueado ? "resultado-partido--bloqueado" : ""
            }`}
            key={partido.id_match}
          >
            <div className="partido-encabezado">
              <strong>{partido.teamAName}</strong>
              <span>vs</span>
              <strong>{partido.teamBName}</strong>
            </div>

            <div className="acciones-ejemplo">
              {bloqueado && (
                <button
                  type="button"
                  className="boton-modificar"
                  onClick={() => modificarPartido(partido.id_match)}
                >
                  ✏️ Modificar
                </button>
              )}
            </div>

            <div className="resultado-goles">
              <div className="equipo-resultado">
                <span>{partido.teamAName}</span>

                <input
                  type="number"
                  min="0"
                  disabled={bloqueado}
                  value={resultado.golesLocal ?? ""}
                  onChange={(e) =>
                    actualizarCampo(
                      partido.id_match,
                      "golesLocal",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="separador-goles">-</div>

              <div className="equipo-resultado">
                <span>{partido.teamBName}</span>

                <input
                  type="number"
                  min="0"
                  disabled={bloqueado}
                  value={resultado.golesVisitante ?? ""}
                  onChange={(e) =>
                    actualizarCampo(
                      partido.id_match,
                      "golesVisitante",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="equipos-eventos">
              <div className="equipo-columna">
                <h3 className="equipo-columna__titulo">
                  {partido.teamAName}
                </h3>

                <div className="eventos-seccion">
                  <h4>⚽ Goleadores</h4>
                  {renderGoleadores(
                    partido.id_match,
                    jugadoresLocal,
                    resultado.goleadoresLocal || [],
                    "goleadoresLocal"
                  )}
                </div>

                <div className="eventos-seccion">
                  {renderTarjetas(
                    partido.id_match,
                    jugadoresLocal,
                    resultado.amarillasLocal || [],
                    "amarillasLocal",
                    "🟨 Amarillas"
                  )}
                </div>

                <div className="eventos-seccion">
                  {renderTarjetas(
                    partido.id_match,
                    jugadoresLocal,
                    resultado.rojasLocal || [],
                    "rojasLocal",
                    "🟥 Rojas"
                  )}
                </div>
              </div>

              <div className="equipo-columna">
                <h3 className="equipo-columna__titulo">
                  {partido.teamBName}
                </h3>

                <div className="eventos-seccion">
                  <h4>⚽ Goleadores</h4>
                  {renderGoleadores(
                    partido.id_match,
                    jugadoresVisitante,
                    resultado.goleadoresVisitante || [],
                    "goleadoresVisitante"
                  )}
                </div>

                <div className="eventos-seccion">
                  {renderTarjetas(
                    partido.id_match,
                    jugadoresVisitante,
                    resultado.amarillasVisitante || [],
                    "amarillasVisitante",
                    "🟨 Amarillas"
                  )}
                </div>

                <div className="eventos-seccion">
                  {renderTarjetas(
                    partido.id_match,
                    jugadoresVisitante,
                    resultado.rojasVisitante || [],
                    "rojasVisitante",
                    "🟥 Rojas"
                  )}
                </div>
              </div>
            </div>

            {erroresGuardado[partido.id_match] && (
              <div className="aviso-error" role="alert">
                ⚠️ {erroresGuardado[partido.id_match]}
              </div>
            )}

            <button
              type="button"
              className="boton-guardar"
              disabled={bloqueado}
              onClick={() => guardarResultado(partido)}
            >
              💾 Guardar resultado
            </button>
          </div>
        );
      })}
    </section>
  );
}

export default CargarFecha;


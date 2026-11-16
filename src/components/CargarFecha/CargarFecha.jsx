
import { useEffect, useState } from "react";
import { getMatchesWithTeams } from "../../services/matchesService";
import { getPlayers } from "../../services/playersService";
import { actualizarResultado } from "../../services/resultadosService";
import "./CargarFecha.css";

function CargarFecha({ temporada }) {
  const [partidos, setPartidos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [resultados, setResultados] = useState({});
  const [erroresGuardado, setErroresGuardado] = useState({});
  const [partidosBloqueados, setPartidosBloqueados] = useState({});

  useEffect(() => {
    cargarDatos();
  }, [temporada]);

  function agruparGoleadores(goleadores) {
    const agrupados = {};

    goleadores.forEach((g) => {
      const id = Number(g.player_id);
      agrupados[id] = (agrupados[id] || 0) + 1;
    });

    return Object.entries(agrupados).map(([playerId, cantidad]) => ({
      playerId: Number(playerId),
      cantidad,
    }));
  }

  async function cargarDatos() {
    setFechaSeleccionada("");
    setResultados({});
    setErroresGuardado({});

    try {
      const [partidosData, jugadoresData] = await Promise.all([
        getMatchesWithTeams(temporada),
        getPlayers(),
      ]);

      setPartidos(partidosData);
      setJugadores(jugadoresData);

      setPartidosBloqueados(
        Object.fromEntries(
          partidosData.map((partido) => [
            partido.id_match,
            Boolean(partido.jugado),
          ])
        )
      );

      setResultados(
        Object.fromEntries(
          partidosData.map((partido) => {
            const goleadores = partido.scorers || [];

            return [
              partido.id_match,
              {
                golesLocal: partido.goalsA ?? 0,
                golesVisitante: partido.goalsB ?? 0,
                goleadoresLocal: agruparGoleadores(
                  goleadores.filter(
                    (g) =>
                      Number(g.team_id) === Number(partido.teamA_id)
                  )
                ),
                goleadoresVisitante: agruparGoleadores(
                  goleadores.filter(
                    (g) =>
                      Number(g.team_id) === Number(partido.teamB_id)
                  )
                ),
                amarillasLocal: [],
                amarillasVisitante: [],
                rojasLocal: [],
                rojasVisitante: [],
              },
            ];
          })
        )
      );
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

      return {
        ...prev,
        [partidoId]: {
          ...resultadoActual,
          [campo]: valor,
        },
      };
    });

    setErroresGuardado((prev) => ({
      ...prev,
      [partidoId]: "",
    }));
  }

  function agregarEvento(partidoId, campo, jugadorId) {
    if (!jugadorId || partidosBloqueados[partidoId]) return;

    setResultados((prev) => {
      const resultadoActual = prev[partidoId] || {};
      const eventosActuales = resultadoActual[campo] || [];

      if (
        campo === "goleadoresLocal" ||
        campo === "goleadoresVisitante"
      ) {
        if (
          eventosActuales.some(
            (g) => Number(g.playerId) === Number(jugadorId)
          )
        ) {
          return prev;
        }

        const cantidadMaxima =
          campo === "goleadoresLocal"
            ? Number(resultadoActual.golesLocal || 0)
            : Number(resultadoActual.golesVisitante || 0);

        const golesAsignados = eventosActuales.reduce(
          (total, g) => total + Number(g.cantidad || 0),
          0
        );

        if (golesAsignados >= cantidadMaxima) return prev;

        return {
          ...prev,
          [partidoId]: {
            ...resultadoActual,
            [campo]: [
              ...eventosActuales,
              { playerId: Number(jugadorId), cantidad: 1 },
            ],
          },
        };
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

  function actualizarCantidadGoles(
    partidoId,
    campo,
    jugadorId,
    cantidad
  ) {
    const nuevaCantidad = Math.max(0, Number(cantidad) || 0);

    setResultados((prev) => {
      const resultadoActual = prev[partidoId] || {};
      const goleadores = resultadoActual[campo] || [];

      const totalOtros = goleadores
        .filter((g) => g.playerId !== jugadorId)
        .reduce((total, g) => total + g.cantidad, 0);

      const campoMarcador =
        campo === "goleadoresLocal"
          ? "golesLocal"
          : "golesVisitante";

      const maximo = Math.max(
        0,
        Number(resultadoActual[campoMarcador] || 0) - totalOtros
      );

      return {
        ...prev,
        [partidoId]: {
          ...resultadoActual,
          [campo]: goleadores.map((g) =>
            g.playerId === jugadorId
              ? { ...g, cantidad: Math.min(nuevaCantidad, maximo) }
              : g
          ),
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
      (j) => Number(j.id_player) === Number(jugadorId)
    );

    return jugador?.name || `Jugador ${jugadorId}`;
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

    const totalLocal = goleadoresLocal.reduce(
      (total, g) => total + Number(g.cantidad || 0),
      0
    );

    const totalVisitante = goleadoresVisitante.reduce(
      (total, g) => total + Number(g.cantidad || 0),
      0
    );

    if (totalLocal !== golesLocal) {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: `El equipo local tiene ${golesLocal} gol(es), pero asignaste ${totalLocal}.`,
      }));
      return;
    }

    if (totalVisitante !== golesVisitante) {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: `El equipo visitante tiene ${golesVisitante} gol(es), pero asignaste ${totalVisitante}.`,
      }));
      return;
    }

    try {
      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: "",
      }));

      const payload = {
  scorers: [
    ...goleadoresLocal.flatMap((g) =>
      Array.from({ length: Number(g.cantidad) }, () => ({
        player_id: Number(g.playerId),
        team_id: partido.teamA_id,
        own_goal: false,
      }))
    ),
    ...goleadoresVisitante.flatMap((g) =>
      Array.from({ length: Number(g.cantidad) }, () => ({
        player_id: Number(g.playerId),
        team_id: partido.teamB_id,
        own_goal: false,
      }))
    ),
  ],
  yellow_cards: [
    ...(resultado.amarillasLocal || []),
    ...(resultado.amarillasVisitante || []),
  ],
  red_cards: [
    ...(resultado.rojasLocal || []),
    ...(resultado.rojasVisitante || []),
  ],
};

console.log("DATOS ENVIADOS:", payload);

const respuesta = await actualizarResultado(partidoId, payload);

console.log("RESPUESTA DEL BACKEND:", respuesta);

      setPartidosBloqueados((prev) => ({
        ...prev,
        [partidoId]: true,
      }));

      setErroresGuardado((prev) => ({
        ...prev,
        [partidoId]: "Resultado guardado correctamente.",
      }));

      await cargarDatos();
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
    const resultado = resultados[partidoId] || {};

    const cantidadGoles =
      campo === "goleadoresLocal"
        ? Number(resultado.golesLocal || 0)
        : Number(resultado.golesVisitante || 0);

    const totalAsignado = goleadores.reduce(
      (total, g) => total + Number(g.cantidad || 0),
      0
    );

    const bloqueado = partidosBloqueados[partidoId];

    return (
      <>
        <select
          value=""
          disabled={bloqueado || cantidadGoles === 0}
          onChange={(e) =>
            agregarEvento(partidoId, campo, e.target.value)
          }
        >
          <option value="">
            {cantidadGoles === 0
              ? "Primero cargá los goles"
              : "Seleccionar goleador"}
          </option>

          {jugadoresEquipo.map((jugador) => (
            <option
              key={jugador.id_player}
              value={jugador.id_player}
              disabled={goleadores.some(
                (g) =>
                  Number(g.playerId) === Number(jugador.id_player)
              )}
            >
              {jugador.name}
            </option>
          ))}
        </select>

        <div className="contador-eventos">
          {totalAsignado} / {cantidadGoles} goles asignados
        </div>

        {goleadores.length > 0 && (
          <div className="eventos-cargados">
            {goleadores.map((g, indice) => (
              <div className="evento-item" key={g.playerId}>
                <span>{obtenerNombreJugador(g.playerId)}</span>

                <input
                  type="number"
                  min="0"
                  max={cantidadGoles}
                  value={g.cantidad}
                  disabled={bloqueado}
                  onChange={(e) =>
                    actualizarCantidadGoles(
                      partidoId,
                      campo,
                      g.playerId,
                      e.target.value
                    )
                  }
                />

                <span>gol(es)</span>

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
            <option key={jugador.id_player} value={jugador.id_player}>
              {jugador.name}
            </option>
          ))}
        </select>

        {eventos.length > 0 && (
          <div className="eventos-cargados">
            {eventos.map((jugadorId, indice) => (
              <div
                className="evento-item"
                key={`${jugadorId}-${indice}`}
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
        const jugadoresLocal = jugadores;
        const jugadoresVisitante = jugadores;
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

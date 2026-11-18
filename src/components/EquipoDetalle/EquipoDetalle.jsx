
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getCoachByTeam,
  getCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  assignCoach,
  transferCoach,
} from "../../services/coachesService";
import {
  getTeamById,
  getTeamStats,
  getTeamPlayers,
  getTeams,
} from "../../services/teamsService";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  assignPlayer,
  transferPlayer,
} from "../../services/playersService";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import Panel from "../Panel/Panel";
import "./EquipoDetalle.css";

function EquipoDetalle({ esAdmin }) {
  const { teamId } = useParams();
  const [searchParams] = useSearchParams();

  const temporada =
    Number(searchParams.get("season")) || new Date().getFullYear();

  const [equipo, setEquipo] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [entrenador, setEntrenador] = useState(null);
  const [jugadores, setJugadores] = useState([]);

  const [todosLosJugadores, setTodosLosJugadores] = useState([]);
  const [todosLosEntrenadores, setTodosLosEntrenadores] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState("");
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState("");
  const [equipoDestino, setEquipoDestino] = useState("");

  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [huboCambios, setHuboCambios] = useState(false);

  async function cargarDatos() {
    const [
      datosEquipo,
      datosEstadisticas,
      datosEntrenador,
      datosJugadores,
    ] = await Promise.all([
      getTeamById(teamId),
      getTeamStats(teamId, temporada),
      getCoachByTeam(teamId),
      getTeamPlayers(teamId).catch(() => []),
    ]);

    setEquipo(datosEquipo);
    setEstadisticas(datosEstadisticas);
    setEntrenador(datosEntrenador);
    setJugadores(datosJugadores);
  }

  async function cargarDatosAdministrativos() {
    const [listaJugadores, listaEntrenadores, listaEquipos] =
      await Promise.all([
        getPlayers(),
        getCoaches(),
        getTeams(),
      ]);

    setTodosLosJugadores(listaJugadores);
    setTodosLosEntrenadores(listaEntrenadores);
    setEquipos(listaEquipos);
  }

  useEffect(() => {
    setCargando(true);
    setError("");

    cargarDatos()
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [teamId, temporada]);

  async function abrirEdicion() {
    setModoEdicion(true);
    setHuboCambios(false);
    setError("");
    setMensaje("");

    try {
      await cargarDatosAdministrativos();
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelarEdicion() {
    setModoEdicion(false);
    setError("");
    setMensaje("");
    setJugadorSeleccionado("");
    setEntrenadorSeleccionado("");
    setEquipoDestino("");
  }

  async function ejecutarAccion(accion, confirmacion) {
    if (confirmacion && !window.confirm(confirmacion)) return;

    setProcesando(true);
    setError("");
    setMensaje("");

    try {
      await accion();
      setHuboCambios(true);
      await cargarDatos();
      await cargarDatosAdministrativos();
      setMensaje("Cambios guardados correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  async function nuevoJugador() {
    const dni = window.prompt("DNI del jugador:");
    if (!dni) return;

    const name = window.prompt("Nombre del jugador:");
    if (!name) return;

    const position = window.prompt("Posición del jugador (opcional):");

    await ejecutarAccion(async () => {
      await createPlayer({
        dni: Number(dni),
        name,
        position: position || null,
      });
      await assignPlayer(teamId, Number(dni));
    });
  }

  async function editarJugador(jugador) {
    const name = window.prompt("Nombre:", jugador.name);
    if (!name) return;

    const position = window.prompt(
      "Posición:",
      jugador.position || ""
    );

    await ejecutarAccion(() =>
      updatePlayer(jugador.id_player, {
        name,
        position: position || null,
      })
    );
  }

  async function nuevoEntrenador() {
    const dni = window.prompt("DNI del director técnico:");
    if (!dni) return;

    const name = window.prompt("Nombre del director técnico:");
    if (!name) return;

    await ejecutarAccion(async () => {
      await createCoach({ dni: Number(dni), name });
      await assignCoach(teamId, Number(dni));
    });
  }

  async function editarEntrenador() {
    if (!entrenador) return;

    const name = window.prompt("Nombre:", entrenador.name);
    if (!name) return;

    await ejecutarAccion(() =>
      updateCoach(entrenador.id_coach, { name })
    );
  }

  const jugadoresDisponibles = todosLosJugadores.filter(
    (jugador) =>
      !jugadores.some(
        (asignado) =>
          Number(asignado.id_player) === Number(jugador.id_player)
      )
  );

  const entrenadoresDisponibles = todosLosEntrenadores.filter(
    (dt) =>
      Number(dt.id_coach) !== Number(entrenador?.id_coach)
  );

  const otrosEquipos = equipos.filter(
    (item) => String(item.id_team) !== String(teamId)
  );

  if (cargando) {
    return <main className="contenido">Cargando equipo...</main>;
  }

  if (error && !equipo) {
    return <main className="contenido">Error: {error}</main>;
  }

  return (
    <main className="contenido">
      <Link to="/" className="volver">
        ← Volver a posiciones
      </Link>

      <Panel titulo="Ficha del equipo">
        <section className="equipo-detalle">
          <header className="equipo-detalle__encabezado">
            <IdentidadEquipo
              teamId={equipo.id_team}
              teamName={equipo.name}
            />

            <div>
              <h3>{equipo.name}</h3>
              <p>
                Posición {estadisticas.position} · Temporada {temporada}
              </p>
            </div>
          </header>

          <div className="equipo-detalle__estadisticas">
            <span><small>PJ</small>{estadisticas.played}</span>
            <span><small>PG</small>{estadisticas.wins}</span>
            <span><small>PE</small>{estadisticas.draws}</span>
            <span><small>PP</small>{estadisticas.losses}</span>
            <span><small>DG</small>{estadisticas.goal_difference}</span>
          </div>

          <div className="equipo-detalle__entrenador">
            <strong>Director técnico:</strong>{" "}
            {entrenador?.name ?? "Sin DT asignado"}
          </div>

          <section className="equipo-detalle__plantel">
            <h3>Plantel de jugadores</h3>

            {jugadores.length === 0 ? (
              <p>No hay jugadores asignados a este equipo.</p>
            ) : (
              <ul>
                {jugadores.map((jugador) => (
                  <li key={jugador.id_player}>
                    <span>
                      {jugador.name}
                      {jugador.position && ` · ${jugador.position}`}
                    </span>

                    {modoEdicion && (
                      <div className="equipo-detalle__acciones">
                        <button
                          type="button"
                          disabled={procesando}
                          onClick={() => editarJugador(jugador)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="equipo-detalle__boton-eliminar"
                          disabled={procesando}
                          onClick={() =>
                            ejecutarAccion(
                              () => deletePlayer(jugador.id_player),
                              `¿Eliminar a ${jugador.name}?`
                            )
                          }
                        >
                          Eliminar
                        </button>

                        <button
                          type="button"
                          disabled={procesando || !equipoDestino}
                          onClick={() =>
                            ejecutarAccion(() =>
                              transferPlayer(
                                jugador.id_player,
                                Number(equipoDestino)
                              )
                            )
                          }
                        >
                          Transferir
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {esAdmin && !modoEdicion && (
            <div className="equipo-detalle__acciones-principales">
              <button
                type="button"
                className="boton-modificar-equipo"
                onClick={abrirEdicion}
              >
                ✏️ Modificar
              </button>
            </div>
          )}

          {modoEdicion && (
            <section className="equipo-detalle__admin">
              <div className="equipo-detalle__admin-encabezado">
                {!huboCambios && (
                  <button
                    type="button"
                    className="boton-cancelar-equipo"
                    disabled={procesando}
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="button"
                  className="boton-modificar-equipo"
                  disabled={procesando}
                  onClick={cancelarEdicion}
                >
                  Finalizar edición
                </button>
              </div>

              {error && (
                <p className="equipo-detalle__error">{error}</p>
              )}

              {mensaje && (
                <p className="equipo-detalle__mensaje">{mensaje}</p>
              )}

              <div className="equipo-detalle__grupo">
                <h4>Jugadores</h4>

                <button
                  type="button"
                  className="boton-accion-equipo"
                  disabled={procesando}
                  onClick={nuevoJugador}
                >
                  + Registrar jugador
                </button>

                <div className="equipo-detalle__formulario">
                  <select
                    value={jugadorSeleccionado}
                    disabled={procesando}
                    onChange={(e) =>
                      setJugadorSeleccionado(e.target.value)
                    }
                  >
                    <option value="">Seleccionar jugador existente</option>
                    {jugadoresDisponibles.map((jugador) => (
                      <option
                        key={jugador.id_player}
                        value={jugador.id_player}
                      >
                        {jugador.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="boton-accion-equipo"
                    disabled={procesando || !jugadorSeleccionado}
                    onClick={() =>
                      ejecutarAccion(async () => {
                        await assignPlayer(
                          teamId,
                          Number(jugadorSeleccionado)
                        );
                        setJugadorSeleccionado("");
                      })
                    }
                  >
                    Asignar
                  </button>
                </div>
              </div>

              <div className="equipo-detalle__grupo">
                <h4>Director técnico</h4>

                {entrenador ? (
                  <div className="equipo-detalle__acciones">
                    <button
                      type="button"
                      disabled={procesando}
                      onClick={editarEntrenador}
                    >
                      Editar DT
                    </button>

                    <button
                      type="button"
                      className="equipo-detalle__boton-eliminar"
                      disabled={procesando}
                      onClick={() =>
                        ejecutarAccion(
                          () => deleteCoach(entrenador.id_coach),
                          `¿Eliminar a ${entrenador.name}?`
                        )
                      }
                    >
                      Eliminar DT
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="boton-accion-equipo"
                    disabled={procesando}
                    onClick={nuevoEntrenador}
                  >
                    + Registrar DT
                  </button>
                )}

                <div className="equipo-detalle__formulario">
                  <select
                    value={entrenadorSeleccionado}
                    disabled={procesando}
                    onChange={(e) =>
                      setEntrenadorSeleccionado(e.target.value)
                    }
                  >
                    <option value="">Seleccionar DT existente</option>
                    {entrenadoresDisponibles.map((dt) => (
                      <option key={dt.id_coach} value={dt.id_coach}>
                        {dt.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="boton-accion-equipo"
                    disabled={procesando || !entrenadorSeleccionado}
                    onClick={() =>
                      ejecutarAccion(async () => {
                        await assignCoach(
                          teamId,
                          Number(entrenadorSeleccionado)
                        );
                        setEntrenadorSeleccionado("");
                      })
                    }
                  >
                    Asignar DT
                  </button>
                </div>
              </div>

              <div className="equipo-detalle__grupo">
                <h4>Transferencias</h4>

                <select
                  value={equipoDestino}
                  disabled={procesando}
                  onChange={(e) => setEquipoDestino(e.target.value)}
                >
                  <option value="">Seleccionar equipo de destino</option>
                  {otrosEquipos.map((item) => (
                    <option key={item.id_team} value={item.id_team}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {entrenador && (
                  <button
                    type="button"
                    className="boton-accion-equipo"
                    disabled={procesando || !equipoDestino}
                    onClick={() =>
                      ejecutarAccion(() =>
                        transferCoach(
                          entrenador.id_coach,
                          Number(equipoDestino)
                        )
                      )
                    }
                  >
                    Transferir DT
                  </button>
                )}
              </div>
            </section>
          )}
        </section>
      </Panel>
    </main>
  );
}

export default EquipoDetalle;

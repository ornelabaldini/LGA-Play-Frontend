import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import {
  getCoaches,
  getCoachTeam,
  createCoach,
  updateCoach,
  deleteCoach,
  transferCoach,
} from "../../services/coachesService";
import { getTeams } from "../../services/teamsService";
import Panel from "../Panel/Panel";
import "./Entrenadores.css";

function Entrenadores({ esAdmin }) {
  const [entrenadores, setEntrenadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [entrenadorEditando, setEntrenadorEditando] = useState(null);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({});

  const [modalEliminar, setModalEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarDatos() {
    setCargando(true);
    setError("");

    try {
      const [listaEntrenadores, listaEquipos] = await Promise.all([
        getCoaches(),
        getTeams(),
      ]);

      const entrenadoresConEquipo = await Promise.all(
        listaEntrenadores.map(async (entrenador) => {
          const equipo = await getCoachTeam(entrenador.id_coach);
          return { ...entrenador, equipo };
        })
      );

      setEntrenadores(entrenadoresConEquipo);
      setEquipos(listaEquipos);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los entrenadores.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function limpiarFormulario() {
    setDni("");
    setNombre("");
    setEntrenadorEditando(null);
  }

  async function guardarEntrenador(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      if (entrenadorEditando) {
        await updateCoach(entrenadorEditando.id_coach, { name: nombre });
        setMensaje("Entrenador actualizado correctamente.");
      } else {
        await createCoach({ dni: Number(dni), name: nombre });
        setMensaje("Entrenador creado correctamente.");
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar el entrenador.");
    }
  }

  function editarEntrenador(entrenador) {
    setEntrenadorEditando(entrenador);
    setNombre(entrenador.name);
    setDni("");
    setMensaje("");
    setError("");
  }

  function eliminarEntrenador(entrenador) {
    setModalEliminar(entrenador);
  }
  async function confirmarEliminar() {
    if (!modalEliminar) return;

    setEliminando(true);
    setError("");
    setMensaje("");

    try {
      await deleteCoach(modalEliminar.id_coach);
      setMensaje("Entrenador eliminado correctamente.");
      setModalEliminar(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el entrenador.");
    } finally {
      setEliminando(false);
    }
  }
  async function cambiarEquipo(coachId) {
    const teamId = equipoSeleccionado[coachId];

    if (!teamId) return;

    setError("");
    setMensaje("");

    try {
      await transferCoach(coachId, Number(teamId));
      setMensaje("Equipo del entrenador actualizado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo transferir el entrenador.");
    }
  }

  if (cargando) {
    return <main className="contenido">Cargando entrenadores...</main>;
  }

  return (
    <section className="entrenadores">
      <Panel titulo="Directores técnicos">
        {error && <p className="entrenadores__error">{error}</p>}
        {mensaje && <p className="entrenadores__mensaje">{mensaje}</p>}

        {entrenadores.length === 0 ? (
          <p>Todavía no hay entrenadores registrados.</p>
        ) : (
          <div className="entrenadores__lista">
            {entrenadores.map((entrenador) => (
              <article
                className="entrenadores__item"
                key={entrenador.id_coach}
              >
                <div className="entrenadores__datos">
                  <h3>{entrenador.name}</h3>
                  <p>
                    {entrenador.equipo?.name || "Sin equipo asignado"}
                  </p>
                </div>

                {esAdmin && (
                  <div className="entrenadores__acciones">
                    <button
                      type="button"
                      onClick={() => editarEntrenador(entrenador)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarEntrenador(entrenador)}
                    >
                      Eliminar
                    </button>

                    <div className="entrenadores__transferencia">
                      <select
                        value={equipoSeleccionado[entrenador.id_coach] || ""}
                        onChange={(e) =>
                          setEquipoSeleccionado((prev) => ({
                            ...prev,
                            [entrenador.id_coach]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar equipo</option>

                        {equipos.map((equipo) => (
                          <option
                            key={equipo.id_team}
                            value={equipo.id_team}
                          >
                            {equipo.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={!equipoSeleccionado[entrenador.id_coach]}
                        onClick={() => cambiarEquipo(entrenador.id_coach)}
                      >
                        Transferir
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </Panel>

      {esAdmin && (
        <Panel
          titulo={
            entrenadorEditando
              ? "Editar entrenador"
              : "Agregar entrenador"
          }
        >
          <form
            className="entrenadores__formulario"
            onSubmit={guardarEntrenador}
          >
            {!entrenadorEditando && (
              <label>
                DNI
                <input
                  type="number"
                  min="1"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </label>
            )}

            <label>
              Nombre y apellido
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </label>

            <div className="entrenadores__botones">
              <button type="submit">
                {entrenadorEditando ? "Guardar cambios" : "Agregar DT"}
              </button>

              {entrenadorEditando && (
                <button type="button" onClick={limpiarFormulario}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </Panel>
      )}

      {modalEliminar && (
        <Modal
          titulo="Eliminar director técnico"
          descripcion={`¿Estás seguro de que querés eliminar a ${modalEliminar.name}?`}
          textoConfirmar="Eliminar"
          tipo="peligro"
          onClose={() => {
            if (!eliminando) setModalEliminar(null);
          }}
          onConfirm={confirmarEliminar}
          cargando={eliminando}
        />
      )}
    </section>
  );
}

export default Entrenadores;

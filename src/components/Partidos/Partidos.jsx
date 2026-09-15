import { useEffect, useState } from "react";
import { getMatchesWithTeams } from "../../services/matchsService";
import TarjetaPartido from "../TarjetaPartido/TarjetaPartido";
import "./Partidos.css";

function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMatchesWithTeams()
      .then((data) => {
        setPartidos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p>Cargando partidos...</p>;
  }

  if (error) {
    return <p>Error al cargar los partidos: {error}</p>;
  }

  const partidosFiltrados =
    fechaSeleccionada === "todas"
      ? partidos
      : partidos.filter(
          (partido) =>
            partido.matchday === Number(fechaSeleccionada)
        );

  const fechas = partidosFiltrados.reduce((resultado, partido) => {
    const fecha = partido.matchday;

    if (!resultado[fecha]) {
      resultado[fecha] = [];
    }

    resultado[fecha].push(partido);

    return resultado;
  }, {});

  return (
    <div className="partidos">
      <div className="filtro-fecha">
        <label htmlFor="fecha-partidos">Fecha</label>

        <select
          id="fecha-partidos"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        >
          <option value="todas">Todas las fechas</option>

          {Array.from({ length: 22 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Fecha {index + 1}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(fechas).map(
        ([fecha, partidosDeFecha]) => {
          const jugados = partidosDeFecha.filter(
            (partido) => partido.jugado
          );

          const pendientes = partidosDeFecha.filter(
            (partido) => !partido.jugado
          );

          return (
            <section className="fecha-fixture" key={fecha}>
              <h3>Fecha {fecha}</h3>

              {jugados.length > 0 && (
                <>
                  <h4>Resultados</h4>

                  <div className="fecha-fixture__lista">
                    {jugados.map((partido) => (
                      <TarjetaPartido
                        key={partido.id_match}
                        partido={partido}
                      />
                    ))}
                  </div>
                </>
              )}

              {pendientes.length > 0 && (
                <>
                  <h4>Próximos partidos</h4>

                  <div className="fecha-fixture__lista">
                    {pendientes.map((partido) => (
                      <TarjetaPartido
                        key={partido.id_match}
                        partido={partido}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        }
      )}
    </div>
  );
}

export default Partidos;

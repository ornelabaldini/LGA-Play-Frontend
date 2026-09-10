import { useEffect, useState } from "react";
import { getMatchesWithTeams } from "../../services/matchsService";
import TarjetaPartido from "../TarjetaPartido/TarjetaPartido";
import "./Partidos.css";

function agruparPorFecha(partidos) {
  return partidos.reduce((fechas, partido) => {
    const fecha = partido.matchday;

    if (!fechas[fecha]) {
      fechas[fecha] = [];
    }

    fechas[fecha].push(partido);

    return fechas;
  }, {});
}

function Partidos() {
  const [partidos, setPartidos] = useState([]);
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

  const partidosPorFecha = agruparPorFecha(partidos);

  return (
    <div className="partidos">
      {Object.entries(partidosPorFecha).map(
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
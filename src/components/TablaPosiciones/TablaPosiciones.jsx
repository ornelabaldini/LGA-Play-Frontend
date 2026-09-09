import "./TablaPosiciones.css"

function TablaPosiciones() {
  const equipos = [
    {
      posicion: 1,
      equipo: "Equipo A",
      pj: 7,
      pg: 6,
      pe: 0,
      pp: 1,
      gf: 15,
      gc: 5,
      dg: 10,
      pts: 18,
    },
    {
      posicion: 2,
      equipo: "Equipo B",
      pj: 7,
      pg: 5,
      pe: 1,
      pp: 1,
      gf: 13,
      gc: 6,
      dg: 7,
      pts: 16,
    },
    {
      posicion: 3,
      equipo: "Equipo C",
      pj: 7,
      pg: 4,
      pe: 1,
      pp: 2,
      gf: 11,
      gc: 8,
      dg: 3,
      pts: 13,
    },
    {
      posicion: 4,
      equipo: "Equipo D",
      pj: 7,
      pg: 3,
      pe: 1,
      pp: 3,
      gf: 9,
      gc: 9,
      dg: 0,
      pts: 10,
    },
    {
      posicion: 5,
      equipo: "Equipo E",
      pj: 7,
      pg: 2,
      pe: 2,
      pp: 3,
      gf: 8,
      gc: 10,
      dg: -2,
      pts: 8,
    },
    {
      posicion: 6,
      equipo: "Equipo F",
      pj: 7,
      pg: 1,
      pe: 2,
      pp: 4,
      gf: 6,
      gc: 12,
      dg: -6,
      pts: 5,
    },
  ]

  return (
    <div className="tabla-container">
      <table className="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>PTS</th>
          </tr>
        </thead>

        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.posicion}>
              <td>{equipo.posicion}</td>
              <td>{equipo.equipo}</td>
              <td>{equipo.pj}</td>
              <td>{equipo.pg}</td>
              <td>{equipo.pe}</td>
              <td>{equipo.pp}</td>
              <td>{equipo.gf}</td>
              <td>{equipo.gc}</td>
              <td>{equipo.dg}</td>
              <td>{equipo.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaPosiciones
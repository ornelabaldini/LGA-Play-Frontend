import "./Playoffs.css";

const semifinales = [
  {
    equipoA: "Equipo A",
    equipoB: "Equipo B",
    resultadoA: 2,
    resultadoB: 1,
  },
  {
    equipoA: "Equipo C",
    equipoB: "Equipo D",
    resultadoA: 1,
    resultadoB: 1,
  },
];

function PartidoPlayoff({ partido }) {
  return (
    <div className="partido-playoff">
      <div>
        <span>{partido.equipoA}</span>
        <strong>{partido.resultadoA}</strong>
      </div>

      <div>
        <span>{partido.equipoB}</span>
        <strong>{partido.resultadoB}</strong>
      </div>
    </div>
  );
}

function Playoffs() {
  return (
    <div className="playoffs">
      <div className="playoffs__ronda playoffs__final">
        <h3>Final</h3>

        <div className="partido-playoff">
          <div>
            <span>Ganador semifinal 1</span>
            <strong>-</strong>
          </div>

          <div>
            <span>Ganador semifinal 2</span>
            <strong>-</strong>
          </div>
        </div>
      </div>

      <div className="playoffs__ronda">
        <h3>Semifinales</h3>

        {semifinales.map((partido, index) => (
          <PartidoPlayoff key={index} partido={partido} />
        ))}
  </div>
</div>


  );
}

export default Playoffs;

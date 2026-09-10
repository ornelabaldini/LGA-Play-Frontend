import "./TarjetaPartido.css";

function TarjetaPartido({ partido }) {
  const jugado = Boolean(partido.jugado);

  return (
    <article className="tarjeta-partido">
      <span
        className={`tarjeta-partido__estado ${
          jugado
            ? "tarjeta-partido__estado--jugado"
            : "tarjeta-partido__estado--pendiente"
        }`}
      >
        {jugado ? "Finalizado" : "Próximamente"}
      </span>

      <div className="tarjeta-partido__equipos">
        <strong>{partido.teamAName}</strong>

        <span className="tarjeta-partido__resultado">
          {jugado
            ? `${partido.goalsA} - ${partido.goalsB}`
            : "vs"}
        </span>

        <strong className="tarjeta-partido__visitante">
          {partido.teamBName}
        </strong>
      </div>
    </article>
  );
}

export default TarjetaPartido;
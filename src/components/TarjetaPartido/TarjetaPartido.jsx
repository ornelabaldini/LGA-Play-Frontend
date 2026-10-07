/*
 * Componente encargado de mostrar la información básica de un partido.
 *
 * - Recibe un objeto "partido" mediante props.
 * - Determina si el partido ya fue jugado mediante la propiedad "jugado".
 * - Si el partido terminó, muestra el estado "Finalizado" y el resultado
 *   con los goles de ambos equipos.
 * - Si todavía no se jugó, muestra el estado "Próximamente" y "vs"
 *   en lugar del resultado.
 */

import "./TarjetaPartido.css";

function TarjetaPartido({ partido }) {
  const jugado = Boolean(partido.jugado);

  return (
    <article className="tarjeta-partido">
      <span
        className={`tarjeta-partido__estado ${jugado ? 
        "tarjeta-partido__estado--jugado" : "tarjeta-partido__estado--pendiente"}`}
      >
        {jugado ? "Finalizado" : "Próximamente"}
      </span>

      <div className="tarjeta-partido__equipos">
        <strong>{partido.teamAName}</strong>

        <span className="tarjeta-partido__resultado">
          {jugado ? `${partido.goalsA} - ${partido.goalsB}`: "vs"}
        </span>

        <strong className="tarjeta-partido__visitante"> {partido.teamBName}</strong>

      </div>
    </article>
  );
}

export default TarjetaPartido;
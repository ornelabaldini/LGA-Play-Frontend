import { Link } from "react-router-dom";
import IdentidadEquipo from "../IdentidadEquipo/IdentidadEquipo";
import "./TarjetaPosicion.css";

function TarjetaPosicion({ equipo, posicion }) {
  const partidosJugados =
    equipo.wins + equipo.draws + equipo.losses;

  return (
    <Link
      to={`/equipos/${equipo.id_team}`}
      className="tarjeta-posicion"
    >
      <div className="tarjeta-posicion__encabezado">
        <span className="tarjeta-posicion__puesto">
          {posicion}°
        </span>

        <IdentidadEquipo
          teamId={equipo.id_team}
          teamName={equipo.name}
        />

        <strong className="tarjeta-posicion__nombre">
          {equipo.name}
        </strong>

        <span className="tarjeta-posicion__puntos">
          {equipo.points} pts
        </span>
      </div>

      <div className="tarjeta-posicion__estadisticas">
        <span><small>PJ</small>{partidosJugados}</span>
        <span><small>PG</small>{equipo.wins}</span>
        <span><small>PE</small>{equipo.draws}</span>
        <span><small>PP</small>{equipo.losses}</span>
        <span><small>DG</small>{equipo.goalDifference}</span>
      </div>
    </Link>
  );
}

export default TarjetaPosicion;
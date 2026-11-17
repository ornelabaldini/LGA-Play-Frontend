
import { getTeamIdentity } from "../../data/teamIdentity";
import "./IdentidadEquipo.css";

function IdentidadEquipo({ teamId, teamName }) {
  const escudo = getTeamIdentity(teamId);

  if (!escudo) return null;

  return (
    <img
      className="identidad-equipo"
      src={escudo}
      alt={`Escudo de ${teamName}`}
      title={`Escudo de ${teamName}`}
    />
  );
}

export default IdentidadEquipo;

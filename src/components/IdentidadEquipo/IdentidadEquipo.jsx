import { getTeamIdentity } from "../../data/teamIdentity";
import "./IdentidadEquipo.css";

function IdentidadEquipo({ teamId, teamName }) {
  const { primary, secondary, pattern } = getTeamIdentity(teamId);

  return (
    <span
      className={`identidad-equipo identidad-equipo--${pattern}`}
      style={{
        "--color-principal": primary,
        "--color-secundario": secondary,
      }}
      title={`Colores de ${teamName}`}
      aria-hidden="true"
    />
  );
}

export default IdentidadEquipo;
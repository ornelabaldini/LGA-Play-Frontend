
import { useEffect, useState } from "react";
import { getTeamIdentity } from "../../data/teamIdentity";
import "./IdentidadEquipo.css";

function IdentidadEquipo({ teamId, teamName }) {
  const escudo = getTeamIdentity(teamId);
  const [ampliado, setAmpliado] = useState(false);

  useEffect(() => {
    if (!ampliado) return;

    function cerrarConEscape(event) {
      if (event.key === "Escape") {
        setAmpliado(false);
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [ampliado]);

  if (!escudo) return null;

  return (
    <>
      <button
        type="button"
        className="identidad-equipo__boton"
        onClick={() => setAmpliado(true)}
        aria-label={`Ampliar escudo de ${teamName}`}
      >
        <img
          className="identidad-equipo"
          src={escudo}
          alt={`Escudo de ${teamName}`}
          title={`Escudo de ${teamName}`}
        />
      </button>

      {ampliado && (
        <div
          className="escudo-modal"
          onClick={() => setAmpliado(false)}
        >
          <div
            className="escudo-modal__contenido"
            role="dialog"
            aria-modal="true"
            aria-label={`Escudo de ${teamName}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="escudo-modal__cerrar"
              onClick={() => setAmpliado(false)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>

            <img
              src={escudo}
              alt={`Escudo de ${teamName}`}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default IdentidadEquipo;

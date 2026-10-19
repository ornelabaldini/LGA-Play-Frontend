import { useState } from "react";
import { apiRequest } from "../../api/apiClient";
import "./Ingresar.css";

function Ingresar({ esAdmin, setEsAdmin }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const ingresar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setEsAdmin(true);
      setMostrarFormulario(false);
      setUsername("");
      setPassword("");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    setEsAdmin(false);
    setMostrarFormulario(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setError("");
  };

  return (
    <>
      <button
        className="ingresar"
        onClick={() => {
          if (esAdmin) {
            cerrarSesion();
          } else {
            setMostrarFormulario(true);
          }
        }}
      >
        {esAdmin ? "Cerrar sesión" : "Ingresar"}
      </button>

      {mostrarFormulario && !esAdmin && (
        <div
          className="modal-ingreso"
          onClick={cerrarFormulario}
        >
          <div
            className="modal-ingreso__contenido"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-ingreso"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-ingreso__cerrar"
              onClick={cerrarFormulario}
              aria-label="Cerrar ventana"
            >
              ×
            </button>

            <h2 id="titulo-ingreso">Ingreso de administrador</h2>
            <p>Ingresá tus credenciales para continuar</p>

            <form onSubmit={ingresar}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              {error && <p className="modal-ingreso__error" role="alert">{error}</p>}

              <button type="submit" disabled={cargando}>
                {cargando ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Ingresar;

// Administra el inicio y cierre de sesión de los usuarios.
// Se comunica con el backend para validar credenciales
// y determinar si el usuario tiene permisos de administrador.

import { useState } from "react";
import {
  apiRequest,
  guardarToken,
  eliminarToken,
} from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import "./Ingresar.css";

function Ingresar({ esAdmin, setEsAdmin }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Controla si la contraseña se muestra o se oculta.
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Envía las credenciales al backend y valida el usuario.
  const ingresar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await apiRequest(ENDPOINTS.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      // Guarda el token JWT para las próximas solicitudes.
      guardarToken(respuesta.access_token);

      // Establece los permisos según el tipo de cuenta.
      setEsAdmin(respuesta.user.is_admin === true);

      setMostrarFormulario(false);
      setUsername("");
      setPassword("");
    } catch (error) {
      setError(error.message || "Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  // Cierra la sesión y elimina el token almacenado.
  const cerrarSesion = () => {
    eliminarToken();
    setEsAdmin(false);
    setMostrarFormulario(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  // Abre el formulario de ingreso.
  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setError("");
  };

  // Cierra el formulario y limpia sus mensajes.
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <button
        className="ingresar"
        onClick={() => {
          if (esAdmin) {
            cerrarSesion();
          } else {
            abrirFormulario();
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

            <h2 id="titulo-ingreso">
              Ingreso de administrador
            </h2>

            <p>
              Ingresá tus credenciales para continuar
            </p>

            <form onSubmit={ingresar}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                maxLength={40}
                required
              />

              {/* Campo de contraseña con opción para mostrarla u ocultarla. */}
              <div className="modal-ingreso__password">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  minLength={8}
                  maxLength={128}
                  required
                />

                <button
                  type="button"
                  className="modal-ingreso__ver-password"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={mostrarPassword}
                >
                  {mostrarPassword ? (
                    // Ícono de ojo tachado: la contraseña está visible.
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                      <path d="M9.88 5.09A10.94 10.94 0 0112 4.5c5 0 9 4.5 10 7.5a11.8 11.8 0 01-4.17 5.17" />
                      <path d="M6.61 6.61C4.1 8.03 2.5 10.5 2 12c1 3 5 7.5 10 7.5a10.9 10.9 0 003.39-.54" />
                    </svg>
                  ) : (
                    // Ícono de ojo abierto: la contraseña está oculta.
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7.5 10-7.5S22 12 22 12s-3.5 7.5-10 7.5S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <p className="modal-ingreso__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={cargando}>
                {cargando ? "Procesando..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Ingresar;

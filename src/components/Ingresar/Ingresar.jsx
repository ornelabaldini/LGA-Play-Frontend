
// Administra el registro, inicio y cierre de sesión de los usuarios.
// Se comunica con el backend para crear cuentas, validar credenciales
// y determinar si el usuario tiene permisos de administrador.

import { useState } from "react";
import {
  apiRequest,
  guardarToken,
  eliminarToken,
} from "../../api/apiClient";
import "./Ingresar.css";

function Ingresar({ esAdmin, setEsAdmin }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("ingresar");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Controla si la contraseña se muestra o se oculta.
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Envía las credenciales al backend y valida el usuario.
  const ingresar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // Guarda el token JWT para las próximas solicitudes.
      guardarToken(respuesta.access_token);

      // Establece los permisos según el tipo de cuenta.
      setEsAdmin(respuesta.user.is_admin === true);

      setMostrarFormulario(false);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message || "Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  // Registra una cuenta nueva en el backend.
  const registrar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      // Informa que la cuenta fue creada correctamente.
      setMensaje("Tu cuenta fue creada exitosamente. Ya podés iniciar sesión.");

      // Cambia al formulario de ingreso.
      setModoFormulario("ingresar");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message || "No se pudo completar el registro.");
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
    setEmail("");
    setPassword("");
    setError("");
    setMensaje("");
  };

  // Abre el formulario de ingreso o registro.
  const abrirFormulario = (modo) => {
    setModoFormulario(modo);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  // Cierra el formulario y limpia sus mensajes.
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setError("");
    setMensaje("");
    setUsername("");
    setEmail("");
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
            abrirFormulario("ingresar");
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
              {modoFormulario === "ingresar"
                ? "Ingreso de administrador"
                : "Crear una cuenta"}
            </h2>

            <p>
              {modoFormulario === "ingresar"
                ? "Ingresá tus credenciales para continuar"
                : "Completá tus datos para registrarte"}
            </p>

            <form
              onSubmit={
                modoFormulario === "ingresar" ? ingresar : registrar
              }
            >
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

              {modoFormulario === "registrar" && (
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              )}

              {/* Campo de contraseña con opción para mostrarla u ocultarla. */}
              <div className="modal-ingreso__password">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    modoFormulario === "ingresar"
                      ? "current-password"
                      : "new-password"
                  }
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

              {mensaje && (
                <p className="modal-ingreso__exito" role="status">
                  {mensaje}
                </p>
              )}

              <button type="submit" disabled={cargando}>
                {cargando
                  ? "Procesando..."
                  : modoFormulario === "ingresar"
                    ? "Iniciar sesión"
                    : "Registrarme"}
              </button>
            </form>

            <div className="modal-ingreso__alternar">
              {modoFormulario === "ingresar" ? (
                <>
                  ¿No tenés cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => abrirFormulario("registrar")}
                  >
                    Registrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tenés cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => abrirFormulario("ingresar")}
                  >
                    Ingresá
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ingresar;




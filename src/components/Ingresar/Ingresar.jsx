
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
      setMensaje("¡Bienvenido a LGA-Play! ⚽ Tu cuenta fue creada exitosamente. Ya podés iniciar sesión y disfrutar de la plataforma.");

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

              <input
                type="password"
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




import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiClient";

// Permite consultar y administrar los permisos de los usuarios.
function AdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consulta los usuarios registrados al cargar el componente.
  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const data = await apiRequest("/auth/users");
        setUsuarios(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, []);

  if (cargando) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error}</p>;
  }

  return (
    <section className="administrar-usuarios">
      <h2>Administrar usuarios</h2>

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div>
          {usuarios.map((usuario) => (
            <div key={usuario.id}>
              <p><strong>{usuario.username}</strong></p>
              <p>{usuario.email}</p>
              <p>{usuario.is_admin ? "Administrador" : "Usuario"}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdministrarUsuarios;
import "./Ingresar.css";

function Ingresar({ esAdmin, setEsAdmin }) {
  const ingresar = () => {
    setEsAdmin(true);
  };

  const cerrarSesion = () => {
    setEsAdmin(false);
  };

  return (
    <>
      <button
        className="ingresar"
        onClick={esAdmin ? cerrarSesion : ingresar}
      >
        {esAdmin ? "Cerrar sesión" : "Ingresar"}
      </button>
    </>
  );
}

export default Ingresar;

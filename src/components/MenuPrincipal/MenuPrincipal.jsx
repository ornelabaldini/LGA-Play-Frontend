import "./MenuPrincipal.css";

function MenuPrincipal({ seccion, setSeccion }) {
  const opciones = [
    { icono: "🏆", texto: "Tabla de posiciones", seccion: "tabla" },
    { icono: "📅", texto: "Fixture y resultados", seccion: "partidos" },
    { icono: "👟", texto: "Goleadores", seccion: "goleadores" },
    { icono: "🔥", texto: "Playoffs", seccion: "playoffs" }
  ];

  return (
    <nav className="menu">
      {opciones.map((opcion) => (
        <button
          key={opcion.texto}
          className={seccion === opcion.seccion ? "activo" : ""}
          onClick={() => setSeccion(opcion.seccion)}
        >
          <span className="menu__icono">
            {opcion.icono}
          </span>

          <span>
            {opcion.texto}
          </span>
        </button>
      ))}
    </nav>
  );
}

export default MenuPrincipal;
import "./MenuPrincipal.css";

function MenuPrincipal() {
  const opciones = [
    { icono: "🏆", texto: "Posiciones" },
    { icono: "⚽", texto: "Goleadores" },
    { icono: "📊", texto: "Estadísticas" },
    { icono: "📅", texto: "Fechas" }
  ];

  return (
    <nav className="menu">
      {opciones.map((opcion) => (
        <button key={opcion.texto}>
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
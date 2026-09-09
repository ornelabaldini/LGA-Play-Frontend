import { useState } from "react";
import "./Header.css";
import lga from "../../assets/lga.png";

function Header() {
  const [imagenGrande, setImagenGrande] = useState(false);

  return (
    <>
      <header className="header">

        {/* Cancha de fondo */}
        <div className="header__cancha">
          <div className="header__lineaCentral"></div>
          <div className="header__circuloCentral"></div>

          <div className="header__area header__area--izquierda"></div>
          <div className="header__area header__area--derecha"></div>

          <div className="header__areaChica header__areaChica--izquierda"></div>
          <div className="header__areaChica header__areaChica--derecha"></div>

          <div className="header__arco header__arco--izquierda"></div>
          <div className="header__arco header__arco--derecha"></div>
        </div>

        {/* Contenido */}
        <div className="header__contenido">

          <div className="header__logo">
            <img
              src={lga}
              alt="Liga de Fútbol General Alvarado"
              onClick={() => setImagenGrande(true)}
            />
          </div>

          <div className="header__texto">
            <h1>LGA-PLAY</h1>
            <p>Liga de Fútbol General Alvarado</p>
          </div>

        </div>
      </header>

      {/* Logo ampliado */}
      {imagenGrande && (
        <div
          className="logo-modal"
          onClick={() => setImagenGrande(false)}
        >
          <img
            src={lga}
            alt="Liga de Fútbol General Alvarado"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default Header;
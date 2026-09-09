
import { useState } from "react";
import "./Header.css";
import lga from "../../assets/lga.png";

function Header() {
  const [imagenGrande, setImagenGrande] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__cancha">
          <div className="header__linea"></div>
          <div className="header__circulo"></div>
        </div>

        <div className="header__contenido">
          <div className="header__logo">
            <img
              src={lga}
              alt="Liga de Fútbol General Alvarado"
              onClick={() => setImagenGrande(true)}
            />
          </div>

          <div>
            <h1>LGA-PLAY</h1>
            <p>Liga de Fútbol General Alvarado</p>
          </div>
        </div>
      </header>

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


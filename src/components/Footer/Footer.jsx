import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cancha">
        <div className="footer__linea"></div>
        <div className="footer__circulo"></div>
      </div>

      <div className="footer__contenido">
        <div className="footer__titulo">
          <strong>LGA PLAY</strong>
          <span>Fútbol de General Alvarado</span>
        </div>

        <div className="footer__info">
          <span>Resultados</span>
          <span>•</span>
          <span>Posiciones</span>
          <span>•</span>
          <span>Información</span>
        </div>

        <div className="footer__copyright">
          © {new Date().getFullYear()} LGA PLAY
        </div>
      </div>
    </footer>
  );
}

export default Footer;
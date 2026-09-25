import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import TablaPosiciones from "./components/TablaPosiciones/TablaPosiciones";
import Panel from "./components/Panel/Panel";
import SelectorTemporada from "./components/SelectorTemporada/SelectorTemporada";
import Partidos from "./components/Partidos/Partidos";
import Goleadores from "./components/Goleadores/Goleadores";
import EquipoDetalle from "./components/EquipoDetalle/EquipoDetalle";
import MenuPrincipal from "./components/MenuPrincipal/MenuPrincipal";
import Playoffs from "./components/Playoffs/Playoffs";
import CargarFecha from "./components/CargarFecha/CargarFecha";

import "./App.css";

function Inicio({ esAdmin }) {
  const [seccion, setSeccion] = useState("tabla");
  const [temporada, setTemporada] = useState(new Date().getFullYear());

 useEffect(() => {
  const timer = setTimeout(() => {
    const elemento = document.getElementById(seccion);

    if (elemento) {
      const posicion =
        elemento.getBoundingClientRect().top +
        window.scrollY -
        150;

      window.scrollTo({
        top: posicion,
        behavior: "smooth",
      });
    }
  }, 500);

  return () => clearTimeout(timer);
}, [seccion]);

  return (
    <main className="contenido">
      <Hero />

      <SelectorTemporada
          temporada={temporada}
          onChange={setTemporada}
        />

      <MenuPrincipal
        seccion={seccion}
        setSeccion={setSeccion}
        esAdmin={esAdmin}
      />

      {seccion === "tabla" && (
        <div id="tabla">
          <Panel titulo="">
            <TablaPosiciones />
          </Panel>
        </div>
      )}

      {seccion === "partidos" && (
        <div id="partidos">
          <Panel titulo="⚽ Fixture">
            <Partidos />
          </Panel>
        </div>
      )}

      {seccion === "goleadores" && (
        <div id="goleadores">
          <Panel titulo="👟 Goleadores">
            <Goleadores temporada={temporada} />
          </Panel>
        </div>
      )}

      {seccion === "playoffs" && (
        <div id="playoffs">
          <Panel titulo="🔥 Playoffs">
            <Playoffs />
          </Panel>
        </div>
      )}

      {esAdmin && seccion === "cargarFecha" && (
        <div id="cargarFecha">
          <Panel titulo="Cargar Fecha">
            <CargarFecha />
          </Panel>
        </div>
      )}
    </main>
  );
}

function App() {
  const [esAdmin, setEsAdmin] = useState(false);

  return (
    <div className="app">
      <Header
        esAdmin={esAdmin}
        setEsAdmin={setEsAdmin}
      />

      <Routes>
        <Route
          path="/"
          element={<Inicio esAdmin={esAdmin} />}
        />

        <Route
          path="/equipos/:teamId"
          element={<EquipoDetalle />}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;

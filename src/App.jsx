import { useState } from "react";
import { Route, Routes } from "react-router-dom";

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

import "./App.css";

function Inicio() {
  const [seccion, setSeccion] = useState("tabla");

  return (
    <main className="contenido">
      <Hero />

      <SelectorTemporada />
        <MenuPrincipal seccion={seccion} setSeccion={setSeccion} />


      {seccion === "tabla" && (
        <Panel titulo="🏆 Tabla de posiciones">
          <TablaPosiciones />
        </Panel>
      )}

      {seccion === "partidos" && (
        <Panel titulo="📅 Fixture y resultados">
          <Partidos />
        </Panel>
      )}

      {seccion === "goleadores" && (
        <Panel titulo="👟 Goleadores">
          <Goleadores />
        </Panel>
      )}

      {seccion === "playoffs" && (
        <Panel titulo="🔥 Playoffs">
          <Playoffs />
        </Panel>
      )}
    </main>
  );
}

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/equipos/:teamId" element={<EquipoDetalle />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
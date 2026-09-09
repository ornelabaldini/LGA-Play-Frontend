
import { useState } from 'react'

import Footer from "./components/Footer/Footer"
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import TablaPosiciones from './components/TablaPosiciones/TablaPosiciones'
import Panel from './components/Panel/Panel'
import SelectorTemporada from './components/SelectorTemporada/SelectorTemporada'
import MenuPrincipal from './components/MenuPrincipal/MenuPrincipal'

import './App.css'

function App() {
  const [seccion, setSeccion] = useState('tabla')

  return (
    <div className="app">
      <Header />

      <main className="contenido">
        <Hero />

        <SelectorTemporada />

        <nav className="menu">
          <button onClick={() => setSeccion('tabla')}>
            🏆 Tabla de posiciones
          </button>

          <button onClick={() => setSeccion('partidos')}>
            ⚽ Partidos / resultados
          </button>

          <button onClick={() => setSeccion('goleadores')}>
            👟 Goleadores
          </button>

          <button onClick={() => setSeccion('playoffs')}>
            🔥 Playoffs
          </button>
        </nav>

        {seccion === 'tabla' && (
          <Panel titulo="🏆 Tabla de posiciones">
            <TablaPosiciones />
          </Panel>
        )}

        {seccion === 'partidos' && (
          <Panel titulo="⚽ Partidos / resultados">
            <p>
              Acá aparecerán los partidos y resultados de la temporada seleccionada.
            </p>
          </Panel>
        )}

        {seccion === 'goleadores' && (
          <Panel titulo="👟 Goleadores">
            <p>
              Acá aparecerá la tabla de goleadores.
            </p>
          </Panel>
        )}

        {seccion === 'playoffs' && (
          <Panel titulo="🔥 Playoffs">
            <p>
              Acá aparecerá el cuadro de playoffs.
            </p>
          </Panel>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App

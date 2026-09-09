import { useState } from 'react'

import Footer from "./components/Footer/Footer";
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import TablaPosiciones from './components/TablaPosiciones/TablaPosiciones'

import './App.css'

function App() {
  const [seccion, setSeccion] = useState('tabla')

  return (
    <div className="app">
      <Header />

      <main className="contenido">
        <Hero />

        <section className="selector">
          <label htmlFor="temporada">Temporada</label>

          <select id="temporada">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </section>

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
          <section className="panel">
            <h2>🏆 Tabla de posiciones</h2>
            <TablaPosiciones />
          </section>
        )}

        {seccion === 'partidos' && (
          <section className="panel">
            <h2>⚽ Partidos / resultados</h2>
            <p>
              Acá aparecerán los partidos y resultados de la temporada seleccionada.
            </p>
          </section>
        )}

        {seccion === 'goleadores' && (
          <section className="panel">
            <h2>👟 Goleadores</h2>
            <p>
              Acá aparecerá la tabla de goleadores.
            </p>
          </section>
        )}

        {seccion === 'playoffs' && (
          <section className="panel">
            <h2>🔥 Playoffs</h2>
            <p>
              Acá aparecerá el cuadro de playoffs.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
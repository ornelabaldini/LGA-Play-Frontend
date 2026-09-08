import Header from './components/Header'

function App() {
  return (
    <div>
      <Header />

      <main>
        <section className="hero">
          <h2>⚽ Todo el fútbol en un solo lugar</h2>
          <p>Resultados, posiciones y goleadores de tu torneo.</p>
        </section>

        <section className="selector">
          <label htmlFor="temporada">Temporada</label>
          <select id="temporada">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </section>

        <section className="panel">
          <h2>🔥 Próximos partidos</h2>
          <p>Acá aparecerán los partidos de la temporada seleccionada.</p>
        </section>

        <section className="panel">
          <h2>🏆 Tabla de posiciones</h2>
          <p>Acá aparecerá la tabla actualizada.</p>
        </section>
      </main>
    </div>
  )
}

export default App
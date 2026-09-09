import "./SelectorTemporada.css";

function SelectorTemporada() {
  return (
    <section className="selector">
      <label htmlFor="temporada">
        Temporada
      </label>

      <select id="temporada">
        <option value="2026">2026</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
    </section>
  );
}

export default SelectorTemporada;
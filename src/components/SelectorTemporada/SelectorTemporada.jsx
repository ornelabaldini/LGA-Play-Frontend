import "./SelectorTemporada.css";

function SelectorTemporada({ temporada, onChange }) {
  return (
    <section className="selector">
      <label htmlFor="temporada">Temporada</label>

      <select
        id="temporada"
        value={temporada}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="2026">2026</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
    </section>
  );
}

export default SelectorTemporada;
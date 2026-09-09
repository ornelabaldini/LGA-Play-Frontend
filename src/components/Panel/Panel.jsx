import "./Panel.css";

function Panel({ titulo, children }) {
  return (
    <section className="panel">
      <h2>{titulo}</h2>

      <div className="panel__contenido">
        {children}
      </div>
    </section>
  );
}

export default Panel;
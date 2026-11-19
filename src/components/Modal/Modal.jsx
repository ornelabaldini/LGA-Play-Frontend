import "./Modal.css";

function Modal({
  titulo,
  descripcion,
  campos = [],
  valores = {},
  onChange,
  onClose,
  onConfirm,
  textoConfirmar = "Guardar",
  textoCancelar = "Cancelar",
  cargando = false,
  tipo = "formulario",
}) {
  const confirmar = (e) => {
    e.preventDefault();
    onConfirm?.();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__contenido"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__cerrar"
          onClick={onClose}
          aria-label="Cerrar"
          disabled={cargando}
        >
          ×
        </button>

        <h2>{titulo}</h2>

        {descripcion && (
          <p className="modal__descripcion">{descripcion}</p>
        )}

        <form onSubmit={confirmar}>
          <div className="modal__campos">
            {campos.map((campo) => (
              <label key={campo.name}>
                {campo.label}

                <input
                  type={campo.type || "text"}
                  value={valores[campo.name] ?? ""}
                  required={campo.required || false}
                  disabled={cargando}
                  onChange={(e) =>
                    onChange(campo.name, e.target.value)
                  }
                />
              </label>
            ))}
          </div>

          <div className="modal__acciones">
            <button
              type="button"
              className="modal__cancelar"
              onClick={onClose}
              disabled={cargando}
            >
              {textoCancelar}
            </button>

            <button
              type="submit"
              className={`modal__confirmar modal__confirmar--${tipo}`}
              disabled={cargando}
            >
              {cargando ? "Procesando..." : textoConfirmar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
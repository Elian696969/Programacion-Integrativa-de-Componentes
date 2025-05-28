class DataCrud extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.recomendaciones = JSON.parse(localStorage.getItem('recomendaciones')) || [];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('#form').addEventListener('submit', (e) => this.agregarRecomendacion(e));
    this.shadowRoot.querySelector('#cancelar').addEventListener('click', () => this.cancelarEdicion());
  }

  guardarEnLocalStorage() {
    localStorage.setItem('recomendaciones', JSON.stringify(this.recomendaciones));
    this.dispatchEvent(new CustomEvent('data-updated', {
      bubbles: true,
      composed: true,
      detail: this.recomendaciones
    }));
  }

  agregarRecomendacion(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector('#recomendacion');
    const texto = input.value.trim();
    const id = this.shadowRoot.querySelector('#id').value;

    if (!texto) {
      alert("Ingresa una recomendación válida.");
      return;
    }

    if (id === '') {
      this.recomendaciones.unshift({ id: Date.now(), texto });
    } else {
      const index = this.recomendaciones.findIndex(r => r.id == id);
      this.recomendaciones[index].texto = texto;
    }

    this.resetFormulario();
    this.guardarEnLocalStorage();
    this.render();
  }

  editarRecomendacion(id) {
    const rec = this.recomendaciones.find(r => r.id == id);
    this.shadowRoot.querySelector('#recomendacion').value = rec.texto;
    this.shadowRoot.querySelector('#id').value = rec.id;
    this.shadowRoot.querySelector('#cancelar').style.display = 'inline';
  }

  eliminarRecomendacion(id) {
    if (confirm("¿Estás seguro de eliminar esta recomendación?")) {
      this.recomendaciones = this.recomendaciones.filter(r => r.id != id);
      this.guardarEnLocalStorage();
      this.render();
    }
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.shadowRoot.querySelector('#recomendacion').value = '';
    this.shadowRoot.querySelector('#id').value = '';
    this.shadowRoot.querySelector('#cancelar').style.display = 'none';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: #f2f7ff;
          padding: 1.5rem;
          border-radius: 16px;
          max-width: 550px;
          margin: 2rem auto;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', sans-serif;
        }

        h3 {
          text-align: center;
          margin-bottom: 1.2rem;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.75em;
          margin-bottom: 1em;
        }

        input[type="text"] {
          padding: 0.7em;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
        }

        button {
          padding: 0.6em 1em;
          border-radius: 8px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s ease;
        }

        button[type="submit"] {
          background: #58d68d;
          color: white;
        }

        #cancelar {
          background: #f39c12;
          color: white;
          display: none;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          background: #ffffff;
          margin-bottom: 0.75em;
          padding: 0.8em 1em;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          margin-left: 0.4em;
        }

        .actions button:hover {
          color: #2980b9;
        }

        .actions button:last-child:hover {
          color: #c0392b;
        }
      </style>

      <h3>Gestión de Recomendaciones</h3>
      <form id="form">
        <input type="hidden" id="id">
        <input type="text" id="recomendacion" placeholder="Escribe una recomendación..." />
        <div class="button-group">
          <button type="submit">Guardar</button>
          <button type="button" id="cancelar">Cancelar</button>
        </div>
      </form>
      <ul>
        ${this.recomendaciones.map(r => `
          <li>
            ${r.texto}
            <span class="actions">
              <button title="Editar" onclick="this.getRootNode().host.editarRecomendacion(${r.id})">✏️</button>
              <button title="Eliminar" onclick="this.getRootNode().host.eliminarRecomendacion(${r.id})">🗑️</button>
            </span>
          </li>
        `).join('')}
      </ul>
    `;
  }
}

customElements.define('data-crud', DataCrud);
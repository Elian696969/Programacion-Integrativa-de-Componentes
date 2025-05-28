class EducationalSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Array de artículos educativos
    this.articles = [
      {
        titulo: "¿Qué es el PM2.5?",
        contenido: "Son partículas muy finas que pueden penetrar profundamente en los pulmones y causar problemas respiratorios."
      },
      {
        titulo: "¿Cómo protegerse de la contaminación?",
        contenido: "Evita actividades al aire libre cuando los niveles de contaminación son altos. Usa mascarilla si es necesario."
      },
      {
        titulo: "Efectos del CO₂ en la salud",
        contenido: "Altas concentraciones pueden provocar mareos, fatiga y disminución de la capacidad cognitiva."
      },
      {
        titulo: "Importancia del ozono (O₃)",
        contenido: "A nivel del suelo, puede irritar los ojos y los pulmones. Se forma por reacciones químicas entre contaminantes."
      }
    ];
  }

  connectedCallback() {
    this.render();
  }

  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        section {
          margin-left: 220px;
          padding: 2rem;
          font-family: Arial, sans-serif;
          background: #f9f9f9;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .article {
          background: #ffffff;
          padding: 1rem;
          margin-bottom: 1rem;
          border-left: 5px solid #3498db;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .article:hover {
          transform: translateY(-2px);
        }

        .article h3 {
          margin: 0 0 0.5rem 0;
          color: #2980b9;
        }

        .article p {
          margin: 0;
          color: #555;
        }
      </style>

      <section>
        <h2>Sección Educativa</h2>
        ${this.articles.map(art => `
          <div class="article">
            <h3>${art.titulo}</h3>
            <p>${art.contenido}</p>
          </div>
        `).join("")}
      </section>
    `;
  };
}

customElements.define("educational-section", EducationalSection);

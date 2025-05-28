class MainMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          color: white;
          padding: 1rem;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .menu-items {
          display: flex;
          gap: 1rem;
        }

        .menu-items a {
          color: white;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s;
        }

        .menu-items a:hover {
          color: #ffe082;
        }
      </style>

      <nav>
        <div class="logo">AirGuard</div>
        <div class="menu-items">
          <a data-section="dashboard">Inicio</a>
          <a data-section="educativo">Educate</a>
          <a data-section="recomendaciones">Recomendaciones</a>
          <a data-section="acerca">Acerca</a>
        </div>
      </nav>
    `;

    this.shadowRoot.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-section');
        const section = document.getElementById(targetId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };
}

customElements.define('main-menu', MainMenu);

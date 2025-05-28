class AirQualityDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.data = [];
  }

  connectedCallback() {
    this.fetchAirData();
  }

  fetchAirData = async () => {
    try {
      const response = await fetch("https://run.mocky.io/v3/c485ff7c-8fea-4991-aa6b-239c202328ae");
      if (!response.ok) throw new Error('Error al obtener los datos');
      const json = await response.json();

      // Agrupar por estación y obtener la última medición (la de más fecha)
      const grouped = {};
      json.calidad_aire.forEach(item => {
        const station = item.estacion;
        if (!grouped[station] || new Date(item.fecha) > new Date(grouped[station].fecha)) {
          grouped[station] = item;
        }
      });

      this.data = Object.values(grouped);
      this.render();
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      this.shadowRoot.innerHTML = `<p style="color:red;">Error al cargar datos</p>`;
    }
  };

  render = () => {
    if (!this.data.length) return;

    this.shadowRoot.innerHTML = `
      <style>
        .dashboard {
          margin-left: 220px;
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          font-family: Arial, sans-serif;
        }

        .card {
          background: #f0f9ff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          text-align: center;
        }

        h3 {
          margin: 0.5rem 0;
          color: #2c3e50;
        }

        .value {
          font-size: 1.3rem;
          color: #2980b9;
        }

        .station {
          font-weight: bold;
          color: #34495e;
          margin-top: 0.5rem;
        }
      </style>

      <div class="dashboard">
        ${this.data.map(item => `
          <div class="card">
            <div class="station">${item.estacion}</div>
            <h3>PM2.5: <span class="value">${item.pm25} µg/m³</span></h3>
            <h3>PM10: <span class="value">${item.pm10} µg/m³</span></h3>
            <h3>CO: <span class="value">${item.co} ppm</span></h3>
            <h3>NO₂: <span class="value">${item.no2} µg/m³</span></h3>
            <h3>O₃: <span class="value">${item.o3} µg/m³</span></h3>
            <h3>Temp: <span class="value">${item.temperatura} °C</span></h3>
          </div>
        `).join("")}
      </div>
    `;
  };
}

customElements.define("air-quality-dashboard", AirQualityDashboard);

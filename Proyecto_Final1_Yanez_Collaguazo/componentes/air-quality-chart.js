class AirQualityChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.chart = null;
  }

  connectedCallback() {
    this.loadData();
  }

  loadData = async () => {
    try {
      const response = await fetch("https://run.mocky.io/v3/c485ff7c-8fea-4991-aa6b-239c202328ae");
      if (!response.ok) throw new Error('Error al obtener datos');
      const json = await response.json();

      // Obtener última medición por estación
      const latest = {};
      json.calidad_aire.forEach(item => {
        const estacion = item.estacion;
        if (!latest[estacion] || new Date(item.fecha) > new Date(latest[estacion].fecha)) {
          latest[estacion] = item;
        }
      });

      const data = Object.values(latest);
      this.renderChart(data);
    } catch (error) {
      this.shadowRoot.innerHTML = `<p>Error cargando gráfico</p>`;
      console.error(error);
    }
  };

  renderChart = (stations) => {
    this.shadowRoot.innerHTML = `
      <style>
        .chart-container {
          margin-left: 220px;
          padding: 2rem;
          max-width: 800px;
        }
        canvas {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
      </style>
      <div class="chart-container">
        <canvas id="airChart"></canvas>
      </div>
    `;

    const ctx = this.shadowRoot.getElementById('airChart').getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stations.map(e => e.estacion),
        datasets: [{
          label: 'PM2.5 (µg/m³)',
          data: stations.map(e => e.pm25),
          backgroundColor: '#3498db',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw} µg/m³`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Concentración'
            }
          }
        }
      }
    });
  };
}

customElements.define("air-quality-chart", AirQualityChart);

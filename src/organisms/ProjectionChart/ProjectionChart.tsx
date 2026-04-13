import { useRef, useEffect } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { GraphCard } from '../../molecules/GraphCard/GraphCard';
import styles from './ProjectionChart.module.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface MonthProjection {
  mes: number;
  usuarios: number;
  ingresos: number;
  costos: number;
  ganancia: number;
}

interface Summary {
  ingresos_totales: number;
  costos_totales: number;
  ganancia_total: number;
  usuarios_mes_12: number;
  break_even_mes: number | null;
}

interface ProjectionChartProps {
  proyecciones: MonthProjection[];
  resumen: Summary;
}

export function ProjectionChart({ proyecciones, resumen }: ProjectionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const labels = proyecciones.map((m) => `Mes ${m.mes}`);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ingresos',
            data: proyecciones.map((m) => m.ingresos),
            borderColor: '#1b6399',
            backgroundColor: 'rgba(27,99,153,0.08)',
            fill: true,
            tension: 0.36,
            pointRadius: 4,
            pointBackgroundColor: '#1b6399',
            pointBorderColor: '#f7f9fb',
          },
          {
            label: 'Costos',
            data: proyecciones.map((m) => m.costos),
            borderColor: '#506267',
            backgroundColor: 'rgba(80,98,103,0.06)',
            fill: true,
            tension: 0.36,
            pointRadius: 4,
            pointBackgroundColor: '#506267',
            pointBorderColor: '#f7f9fb',
          },
          {
            label: 'Ganancia',
            data: proyecciones.map((m) => m.ganancia),
            borderColor: '#6d5d40',
            backgroundColor: 'rgba(109,93,64,0.08)',
            fill: true,
            tension: 0.36,
            pointRadius: 4,
            pointBackgroundColor: '#6d5d40',
            pointBorderColor: '#f7f9fb',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              color: '#506267',
            },
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderColor: 'rgba(80, 98, 103, 0.12)',
            borderWidth: 1,
            titleColor: '#2c3437',
            bodyColor: '#506267',
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            grid: {
              color: 'rgba(80, 98, 103, 0.1)',
            },
            ticks: {
              color: '#738289',
              callback: (v) => `$${Number(v).toLocaleString()}`,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#738289',
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [proyecciones]);

  return (
    <div className={styles.container}>
      <section className={styles.summaryHero}>
        <div className={styles.summaryIntro}>
          <span className={styles.eyebrow}>Proyección financiera</span>
          <h2 className={styles.title}>Una lectura rápida de ingresos, costos y punto de equilibrio.</h2>
          <p className={styles.description}>
            Este escenario resume cómo podría evolucionar la idea durante los
            próximos 12 meses, tomando como base el modelo de negocio, el
            volumen esperado y el ritmo de crecimiento estimado.
          </p>
        </div>

        <div className={styles.summaryCards}>
          <GraphCard title="Ingresos totales (12m)" value={`$${resumen.ingresos_totales.toLocaleString()}`} unit="USD" trend="up" trendLabel="proyectado" icon="REV" />
          <GraphCard title="Costos totales (12m)" value={`$${resumen.costos_totales.toLocaleString()}`} unit="USD" icon="CST" />
          <GraphCard title="Ganancia neta (12m)" value={`$${resumen.ganancia_total.toLocaleString()}`} unit="USD" trend={resumen.ganancia_total >= 0 ? 'up' : 'down'} trendLabel={resumen.ganancia_total >= 0 ? 'positivo' : 'pérdida'} icon="NET" />
          <GraphCard
            title="Break-even"
            value={resumen.break_even_mes ? `Mes ${resumen.break_even_mes}` : 'No alcanzado'}
            icon="B/E"
          />
          <GraphCard title="Usuarios mes 12" value={resumen.usuarios_mes_12.toLocaleString()} icon="M12" />
        </div>
      </section>

      <div className={styles.chartWrapper}>
        <div className={styles.chartHeader}>
          <div>
            <span className={styles.chartEyebrow}>Curva mensual</span>
            <h3 className={styles.chartTitle}>Comparativa entre ingresos, costos y ganancia.</h3>
          </div>
        </div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

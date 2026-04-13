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
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
          },
          {
            label: 'Costos',
            data: proyecciones.map((m) => m.costos),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.06)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
          },
          {
            label: 'Ganancia',
            data: proyecciones.map((m) => m.ganancia),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.06)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => `$${Number(v).toLocaleString()}`,
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
      <div className={styles.summaryCards}>
        <GraphCard title="Ingresos totales (12m)" value={`$${resumen.ingresos_totales.toLocaleString()}`} unit="USD" trend="up" trendLabel="proyectado" icon="📈" />
        <GraphCard title="Costos totales (12m)" value={`$${resumen.costos_totales.toLocaleString()}`} unit="USD" icon="📉" />
        <GraphCard title="Ganancia neta (12m)" value={`$${resumen.ganancia_total.toLocaleString()}`} unit="USD" trend={resumen.ganancia_total >= 0 ? 'up' : 'down'} trendLabel={resumen.ganancia_total >= 0 ? 'positivo' : 'pérdida'} icon="💹" />
        <GraphCard
          title="Break-even"
          value={resumen.break_even_mes ? `Mes ${resumen.break_even_mes}` : 'No alcanzado'}
          icon="⚖️"
        />
        <GraphCard title="Usuarios mes 12" value={resumen.usuarios_mes_12.toLocaleString()} icon="👥" />
      </div>

      <div className={styles.chartWrapper}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

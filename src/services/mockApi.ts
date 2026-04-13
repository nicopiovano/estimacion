import type { AnalyzeResponse, ProjectionResponse } from './api';

const MOCK_DELAY_MS = 1200;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockAnalyze(_idea: string): Promise<AnalyzeResponse> {
  await delay(MOCK_DELAY_MS);
  return {
    analysis: {
      tipo_proyecto: 'SaaS B2B',
      features: [
        'Autenticación y roles de usuario',
        'Dashboard con métricas en tiempo real',
        'API REST con documentación',
        'Módulo de facturación y pagos',
        'Notificaciones por email y push',
        'Panel de administración',
      ],
      complejidad: 'Alta',
      usuarios_estimados: 500,
      requests_por_usuario_por_dia: 120,
      almacenamiento_estimado_mb: 2048,
      integraciones: ['Stripe', 'SendGrid', 'AWS S3'],
      horas_estimadas: 320,
    },
    estimation: {
      requests_totales_diarios: 60000,
      requests_totales_mensuales: 1800000,
      usuarios_concurrentes: 50,
      horas_totales_ajustadas: 416,
      precio_final_usd: 20800,
      dias_entrega_estimados: 52,
      almacenamiento_estimado_mb: 2048,
      costo_por_hora_usd: 50,
      multiplicador_complejidad: 1.3,
    },
  };
}

export async function mockProjection(_params: unknown): Promise<ProjectionResponse> {
  await delay(MOCK_DELAY_MS);
  const proyecciones = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    const usuarios = Math.round(50 * Math.pow(1.15, i));
    const ingresos = usuarios * 49;
    const costos = 800 + usuarios * 3;
    const ganancia = ingresos - costos;
    return { mes, usuarios, ingresos, costos, ganancia };
  });

  return {
    proyecciones,
    resumen: {
      ingresos_totales: proyecciones.reduce((a, p) => a + p.ingresos, 0),
      costos_totales: proyecciones.reduce((a, p) => a + p.costos, 0),
      ganancia_total: proyecciones.reduce((a, p) => a + p.ganancia, 0),
      usuarios_mes_12: proyecciones[11].usuarios,
      break_even_mes: 4,
    },
  };
}

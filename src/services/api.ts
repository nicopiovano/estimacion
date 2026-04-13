export interface AnalyzeResponse {
  analysis: {
    tipo_proyecto: string;
    features: string[];
    complejidad: string;
    usuarios_estimados: number;
    requests_por_usuario_por_dia: number;
    almacenamiento_estimado_mb: number;
    integraciones: string[];
    horas_estimadas: number;
  };
  estimation: {
    requests_totales_diarios: number;
    requests_totales_mensuales: number;
    usuarios_concurrentes: number;
    horas_totales_ajustadas: number;
    precio_final_usd: number;
    dias_entrega_estimados: number;
    almacenamiento_estimado_mb: number;
    costo_por_hora_usd: number;
    multiplicador_complejidad: number;
  };
}

export interface ProjectionResponse {
  proyecciones: { mes: number; usuarios: number; ingresos: number; costos: number; ganancia: number }[];
  resumen: {
    ingresos_totales: number;
    costos_totales: number;
    ganancia_total: number;
    usuarios_mes_12: number;
    break_even_mes: number | null;
  };
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function fetchAnalyze(idea: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al analizar la idea.');
  }
  return res.json();
}

export async function fetchProjection(params: {
  usuarios_iniciales: number;
  precio_mensual: number;
  crecimiento_mensual: number;
  churn_rate: number;
  costos_mensuales: number;
}): Promise<ProjectionResponse> {
  const res = await fetch(`${API_BASE}/api/projection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Error al generar la proyección.');
  }
  return res.json();
}

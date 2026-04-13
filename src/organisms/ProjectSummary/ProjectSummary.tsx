import { Card } from '../../atoms/Card/Card';
import { GraphCard } from '../../molecules/GraphCard/GraphCard';
import { FeatureList } from '../../molecules/FeatureList/FeatureList';
import styles from './ProjectSummary.module.css';

interface AIAnalysis {
  tipo_proyecto: string;
  features: string[];
  complejidad: string;
  usuarios_estimados: number;
  requests_por_usuario_por_dia: number;
  almacenamiento_estimado_mb: number;
  integraciones: string[];
  horas_estimadas: number;
}

interface Estimation {
  requests_totales_diarios: number;
  requests_totales_mensuales: number;
  usuarios_concurrentes: number;
  horas_totales_ajustadas: number;
  precio_final_usd: number;
  dias_entrega_estimados: number;
  almacenamiento_estimado_mb: number;
  costo_por_hora_usd: number;
  multiplicador_complejidad: number;
}

interface ProjectSummaryProps {
  analysis: AIAnalysis;
  estimation: Estimation;
}

const COMPLEJIDAD_LABELS: Record<string, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  muy_alta: 'Muy Alta',
};

export function ProjectSummary({ analysis, estimation }: ProjectSummaryProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.tipoTag}>{analysis.tipo_proyecto.replace('_', ' ')}</span>
        <span className={`${styles.complejidadTag} ${styles[analysis.complejidad]}`}>
          Complejidad: {COMPLEJIDAD_LABELS[analysis.complejidad] ?? analysis.complejidad}
        </span>
      </div>

      <div className={styles.metricsGrid}>
        <GraphCard title="Precio final" value={`$${estimation.precio_final_usd.toLocaleString()}`} unit="USD" icon="💰" />
        <GraphCard title="Horas ajustadas" value={estimation.horas_totales_ajustadas} unit="h" icon="⏱️" />
        <GraphCard title="Días de entrega" value={estimation.dias_entrega_estimados} unit="días" icon="📅" />
        <GraphCard title="Req/día" value={estimation.requests_totales_diarios.toLocaleString()} icon="📡" />
        <GraphCard title="Usuarios concurrentes" value={estimation.usuarios_concurrentes.toLocaleString()} icon="👥" />
        <GraphCard title="Almacenamiento" value={estimation.almacenamiento_estimado_mb} unit="MB" icon="💾" />
      </div>

      <div className={styles.listsRow}>
        <Card title="Features detectadas" padding="sm">
          <FeatureList features={analysis.features} title="" />
        </Card>
        <Card title="Integraciones requeridas" padding="sm">
          <FeatureList features={analysis.integraciones} title="" emptyMessage="Sin integraciones externas." />
        </Card>
      </div>
    </div>
  );
}

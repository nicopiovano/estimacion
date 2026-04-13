import { Card } from '../../atoms/Card/Card';
import { GraphCard } from '../../molecules/GraphCard/GraphCard';
import { FeatureList } from '../../molecules/FeatureList/FeatureList';
import { COMPLEJIDAD_LABELS } from './constants';
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

export function ProjectSummary({ analysis, estimation }: ProjectSummaryProps) {
  const projectType = analysis.tipo_proyecto.replace('_', ' ');

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Estimación principal</span>
          <h2 className={styles.heroValue}>${estimation.precio_final_usd.toLocaleString()}</h2>
          <p className={styles.heroText}>
            Para un proyecto de tipo <strong>{projectType}</strong>, con una
            complejidad <strong>{COMPLEJIDAD_LABELS[analysis.complejidad] ?? analysis.complejidad}</strong>,
            el escenario estimado sugiere una entrega en{' '}
            <strong>{estimation.dias_entrega_estimados} días</strong> y una carga
            inicial de <strong>{estimation.horas_totales_ajustadas} horas</strong>.
          </p>
          <div className={styles.header}>
            <span className={styles.tipoTag}>{projectType}</span>
            <span className={`${styles.complejidadTag} ${styles[analysis.complejidad]}`}>
              Complejidad {COMPLEJIDAD_LABELS[analysis.complejidad] ?? analysis.complejidad}
            </span>
          </div>
        </div>

        <div className={styles.heroFacts}>
          <div className={styles.factCard}>
            <span className={styles.factLabel}>Usuarios estimados</span>
            <strong className={styles.factValue}>{analysis.usuarios_estimados.toLocaleString()}</strong>
          </div>
          <div className={styles.factCard}>
            <span className={styles.factLabel}>Req. por usuario / día</span>
            <strong className={styles.factValue}>{analysis.requests_por_usuario_por_dia.toLocaleString()}</strong>
          </div>
          <div className={styles.factCard}>
            <span className={styles.factLabel}>Costo por hora</span>
            <strong className={styles.factValue}>${estimation.costo_por_hora_usd.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <div className={styles.metricsGrid}>
        <GraphCard title="Precio final" value={`$${estimation.precio_final_usd.toLocaleString()}`} unit="USD" icon="USD" />
        <GraphCard title="Horas ajustadas" value={estimation.horas_totales_ajustadas} unit="h" icon="HRS" />
        <GraphCard title="Días de entrega" value={estimation.dias_entrega_estimados} unit="días" icon="ETA" />
        <GraphCard title="Req/día" value={estimation.requests_totales_diarios.toLocaleString()} icon="REQ" />
        <GraphCard title="Usuarios concurrentes" value={estimation.usuarios_concurrentes.toLocaleString()} icon="CCU" />
        <GraphCard title="Almacenamiento" value={estimation.almacenamiento_estimado_mb} unit="MB" icon="STO" />
      </div>

      <div className={styles.listsRow}>
        <Card title="Funciones detectadas" subtitle="Qué tendría que resolver el producto" padding="md" elevated>
          <FeatureList features={analysis.features} title="" />
        </Card>
        <Card title="Integraciones requeridas" subtitle="Servicios externos o puntos de acople" padding="md" elevated>
          <FeatureList features={analysis.integraciones} title="" emptyMessage="Sin integraciones externas." />
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { WizardTemplate } from '../../templates/WizardTemplate/WizardTemplate';
import { ProjectForm } from '../../organisms/ProjectForm/ProjectForm';
import { ProjectSummary } from '../../organisms/ProjectSummary/ProjectSummary';
import { ProjectionChart } from '../../organisms/ProjectionChart/ProjectionChart';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { fetchAnalyze, fetchProjection } from '../../services/api';
import { mockAnalyze, mockProjection } from '../../services/mockApi';
import type { AnalyzeResponse, ProjectionResponse } from '../../services/api';
import type { ProjectFormData } from '../../organisms/ProjectForm/ProjectForm';
import styles from './ProjectPage.module.css';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const WIZARD_STEPS = [
  { label: 'Tu idea' },
  { label: 'Tu presupuesto' },
  { label: 'Proyección a 12 meses' },
];

const PUBLICO_MAP: Record<string, { usuarios: number; precio: number }> = {
  empresas:       { usuarios: 40,  precio: 49 },
  personas:       { usuarios: 200, precio: 9  },
  profesionales:  { usuarios: 80,  precio: 29 },
  tiendas:        { usuarios: 60,  precio: 39 },
};

function buildIdeaText(data: ProjectFormData): string {
  const publicoLabel: Record<string, string> = {
    empresas: 'empresas y negocios', personas: 'personas en general',
    profesionales: 'profesionales independientes', tiendas: 'tiendas o vendedores',
  };
  const plataformaLabel = data.plataforma.length === 2
    ? 'celular y computadora'
    : data.plataforma[0] ?? 'web';
  const modeloLabel: Record<string, string> = {
    suscripcion: `suscripción mensual${data.precio_cobro ? ` de $${data.precio_cobro}` : ''}`,
    pago_unico: 'pago único',
    gratuito: 'gratuita',
    no_se: 'modelo de negocio a definir',
  };
  const cuandoLabel: Record<string, string> = {
    ya: 'urgente (1-2 meses)', meses: 'en 3-6 meses',
    sin_apuro: 'sin apuro (6-12 meses)', solo_costo: 'sin fecha definida',
  };

  return [
    data.descripcion,
    `Público objetivo: ${publicoLabel[data.publico] ?? data.publico}.`,
    `Plataforma: ${plataformaLabel}.`,
    `Modelo de negocio: ${modeloLabel[data.modelo_negocio] ?? data.modelo_negocio}.`,
    `Urgencia: ${cuandoLabel[data.cuando] ?? data.cuando}.`,
    data.plataforma.length === 2 ? 'Requiere desarrollo tanto mobile como web.' : '',
  ].filter(Boolean).join(' ');
}

function deriveProjectionParams(data: ProjectFormData) {
  const defaults = PUBLICO_MAP[data.publico] ?? { usuarios: 100, precio: 19 };
  const precio_mensual =
    data.modelo_negocio === 'suscripcion'
      ? (Number(data.precio_cobro) || defaults.precio)
      : 0;
  const plataformaMult = data.plataforma.length === 2 ? 1.3 : 1;
  return {
    usuarios_iniciales: Math.round(defaults.usuarios * plataformaMult),
    precio_mensual,
    crecimiento_mensual: 0.10,
    churn_rate: 0.05,
    costos_mensuales: 350,
  };
}

export function ProjectPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResponse | null>(null);
  const [projectionResult, setProjectionResult] = useState<ProjectionResponse | null>(null);

  async function handleFormSubmit(formData: ProjectFormData) {
    setLoading(true);
    setError(null);
    try {
      const idea = buildIdeaText(formData);
      const projParams = deriveProjectionParams(formData);

      const [analyze, proj] = await Promise.all([
        USE_MOCK ? mockAnalyze(idea) : fetchAnalyze(idea),
        USE_MOCK ? mockProjection(projParams) : fetchProjection(projParams),
      ]);

      setAnalyzeResult(analyze);
      setProjectionResult(proj);
      setStep(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <WizardTemplate steps={WIZARD_STEPS} currentStep={step} title="¿Cuánto cuesta hacer tu idea?">
      {step === 0 && (
        <div className={styles.stepContent}>
          {error && <div className={styles.errorBanner}>{error}</div>}
          <ProjectForm onSubmit={handleFormSubmit} loading={loading} />
        </div>
      )}

      {step === 1 && analyzeResult && (
        <div className={styles.stepContent}>
          <ProjectSummary analysis={analyzeResult.analysis} estimation={analyzeResult.estimation} />
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setStep(0)}>Volver</Button>
            <Button onClick={() => setStep(2)}>Ver proyección a 12 meses →</Button>
          </div>
        </div>
      )}

      {step === 2 && projectionResult && (
        <div className={styles.stepContent}>
          <ProjectionChart proyecciones={projectionResult.proyecciones} resumen={projectionResult.resumen} />
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setStep(1)}>Volver</Button>
            <Button variant="secondary" onClick={() => { setStep(0); setAnalyzeResult(null); setProjectionResult(null); }}>
              Analizar otra idea
            </Button>
          </div>
        </div>
      )}

      {step === 2 && !projectionResult && (
        <Card><p>No hay datos de proyección disponibles.</p></Card>
      )}
    </WizardTemplate>
  );
}

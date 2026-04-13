import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../atoms/Button/Button";
import { ProjectForm } from "../../organisms/ProjectForm/ProjectForm";
import { SiteFooter } from "../../organisms/SiteFooter/SiteFooter";
import { fetchAnalyze } from "../../services/api";
import { mockAnalyze } from "../../services/mockApi";
import type { AnalyzeResponse } from "../../services/api";
import type { ProjectFormData } from "../../organisms/ProjectForm/ProjectForm";
import styles from "./ProjectPage.module.css";
import {
  CUANDO_DISPLAY_LABELS,
  GASTOS_EXTRA_APP,
  GASTOS_EXTRA_BASE,
  IDEA_CUANDO_LABELS,
  IDEA_FIN_LABELS,
  IDEA_MODELO_LABELS,
  IDEA_PLATAFORMA_LABELS,
  IDEA_PUBLICO_LABELS,
  IDEA_VOLUMEN_LABELS,
  USE_MOCK,
  WHATSAPP_PHONE_E164,
} from "./constants";
import { formatUsdAmount, getWhatsappBudgetUrl } from "./whatsappBudget";

function formatModeloNegocioIdea(modelo: string, precioCobro: string): string {
  if (modelo === "suscripcion") {
    return `suscripción mensual${precioCobro ? ` de $${precioCobro}` : ""}`;
  }
  return IDEA_MODELO_LABELS[modelo] ?? modelo;
}

function buildContextoLabel(data: ProjectFormData): string {
  if (data.publico === "emprendimiento" || data.publico === "tiendas") {
    const label = IDEA_VOLUMEN_LABELS[data.contexto] ?? data.contexto;
    return `Volumen actual: ${label}.`;
  }
  const label = IDEA_FIN_LABELS[data.contexto] ?? data.contexto;
  return `Propósito del proyecto: ${label}.`;
}

function buildIdeaText(data: ProjectFormData): string {
  return [
    `Público objetivo: ${IDEA_PUBLICO_LABELS[data.publico] ?? data.publico}.`,
    `Plataforma: ${IDEA_PLATAFORMA_LABELS[data.plataforma] ?? data.plataforma}.`,
    data.contexto ? buildContextoLabel(data) : null,
    `Modelo de negocio: ${formatModeloNegocioIdea(
      data.modelo_negocio,
      data.precio_cobro,
    )}.`,
    `Urgencia: ${IDEA_CUANDO_LABELS[data.cuando] ?? data.cuando}.`,
    data.descripcion,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResponse | null>(
    null,
  );
  const [lastFormData, setLastFormData] = useState<ProjectFormData | null>(null);
  const [cuandoElegido, setCuandoElegido] = useState<string>("");
  const [plataformaElegida, setPlataformaElegida] = useState<string>("");

  async function handleFormSubmit(formData: ProjectFormData) {
    setLoading(true);
    setError(null);

    try {
      const idea = buildIdeaText(formData);
      const analyze = USE_MOCK ? mockAnalyze(idea) : fetchAnalyze(idea);
      const result = await analyze;

      setLastFormData(formData);
      setCuandoElegido(formData.cuando);
      setPlataformaElegida(formData.plataforma);
      setAnalyzeResult(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  const highlights = analyzeResult?.analysis.features.slice(0, 3) ?? [];
  const details = analyzeResult
    ? [
        {
          label: "Tiempo de entrega",
          value: CUANDO_DISPLAY_LABELS[cuandoElegido] ?? cuandoElegido,
        },
        {
          label: "Usuarios concurrentes",
          value:
            analyzeResult.estimation.usuarios_concurrentes.toLocaleString(),
        },
      ]
    : [];

  function handleEdit() {
    setAnalyzeResult(null);
    setError(null);
  }

  const incluyeApp =
    plataformaElegida === "app" || plataformaElegida === "ambas";
  const gastosExtra = incluyeApp
    ? [...GASTOS_EXTRA_BASE, ...GASTOS_EXTRA_APP]
    : [...GASTOS_EXTRA_BASE];

  const quoteIncludesItems = [
    "Diseño UI/UX del producto",
    plataformaElegida === "web" && "Publicación en web",
    plataformaElegida === "app" && "Publicación en App Store y Play Store",
    plataformaElegida === "ambas" &&
      "Publicación en web, App Store y Play Store",
    "Mantenimiento y cambios según el plan elegido",
  ].filter(Boolean) as string[];

  return (
    <div className={styles.page}>
      {!analyzeResult ? (
        <div className={styles.modalStage}>
          <div className={styles.modalWrapper}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <ProjectForm
              onSubmit={handleFormSubmit}
              loading={loading}
              initialData={lastFormData ?? undefined}
              onBack={() => navigate("/")}
            />
          </div>
        </div>
      ) : (
        <div className={styles.resultPage}>
          <header className={styles.resultHeader}>
            <div className={styles.resultIcon}>✓</div>
            <h1 className={styles.resultTitle}>¡Todo listo para brillar!</h1>
            <p className={styles.resultDescription}>
              Hemos analizado tu idea y trazado la ruta más eficiente para
              convertirla en realidad. A continuación, tenés tu presupuesto
              inteligente y el siguiente paso para avanzar.
            </p>
            <button
              type="button"
              className={styles.editButton}
              onClick={handleEdit}
            >
              ← Editar respuestas
            </button>
          </header>

          <section className={styles.resultGrid}>
            <div className={styles.summaryColumn}>
              <section className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Resumen Inteligente</h2>
                <p className={styles.summaryText}>
                  Tu proyecto se define como una plataforma de{" "}
                  <strong>
                    {analyzeResult.analysis.tipo_proyecto.replace(/_/g, " ")}
                  </strong>{" "}
                  centrada en una ejecución clara y escalable. Basándonos en tus
                  respuestas, estas son las prioridades iniciales detectadas.
                </p>

                <div className={styles.highlightGrid}>
                  {highlights.map((feature, index) => (
                    <article
                      key={`${feature}-${index}`}
                      className={styles.highlightCard}
                    >
                      <span className={styles.highlightIcon}>{index + 1}</span>
                      <h3 className={styles.highlightTitle}>{feature}</h3>
                      <p className={styles.highlightText}>
                        Incluido dentro del alcance detectado por la IA para
                        esta propuesta.
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <div className={styles.lowerGrid}>
                <section className={styles.detailCard}>
                  <h3 className={styles.detailTitle}>Detalles estimados</h3>
                  <ul className={styles.detailList}>
                    {details.map((detail) => (
                      <li key={detail.label} className={styles.detailItem}>
                        <span>{detail.label}</span>
                        <strong>{detail.value}</strong>
                      </li>
                    ))}
                  </ul>

                  <hr className={styles.detailSeparator} />

                  <h3 className={styles.detailTitle}>Gastos adicionales</h3>
                  <p className={styles.detailNote}>
                    No incluidos en el presupuesto. Son costos de terceros que
                    el cliente abona por separado.
                  </p>
                  <ul className={styles.detailList}>
                    {gastosExtra.map((gasto) => (
                      <li key={gasto.label} className={styles.detailItem}>
                        <span>{gasto.label}</span>
                        <strong>{gasto.value}</strong>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className={styles.visualCard}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIjUGHPkf2dNRhyzNftKRiuWdxgrsYCLDNgNXD00TSp0z0Rap93MtL47_YbiO65ysmdGCEC-tDAiy_lDU9se5X7vFpal88__gvpmTHbqWpX_dcllRhzpvds7ZzXzlK0EviHSTm_EjZlDqczDd4o8Tu5DCA-7-emvBCBuOhPv87cIX3Yhn5iz3ymKc6x3c_wJcRSj0kWN9gcnwfdnrkN0LbyCqE4WKsPOqIvTfW2Wb9NlRn1R4IYoY4Rv94kh-vD6pdD5AFP8p8BuQ"
                    alt="Estudio creativo con iluminación azul"
                  />
                </div>
              </div>
            </div>

            <aside className={styles.quoteColumn}>
              <section className={styles.quoteCard}>
                <span className={styles.quoteLabel}>
                  Inversión estimada (USD)
                </span>
                <div className={styles.quoteValue}>
                  {formatUsdAmount(analyzeResult.estimation.precio_final_usd)}
                </div>
                <br />
                <br />
                <p className={styles.quoteIncludesTitle}>Qué incluye</p>
                <ul className={styles.quoteIncludesList}>
                  {quoteIncludesItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <div className={styles.quoteActions}>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() =>
                    window.open(
                      getWhatsappBudgetUrl(WHATSAPP_PHONE_E164, analyzeResult),
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Me gustaría avanzar <span>→</span>
                </Button>
              </div>
            </aside>
          </section>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

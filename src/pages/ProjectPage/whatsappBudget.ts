import type { AnalyzeResponse } from "../../services/api";

/** Monto en dólares estadounidenses (símbolo $ ISO 4217 USD). */
export function formatUsdAmount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildWhatsappBudgetMessage(result: AnalyzeResponse): string {
  const tipo = result.analysis.tipo_proyecto.replace(/_/g, " ");
  const precio = formatUsdAmount(result.estimation.precio_final_usd);
  const dias = result.estimation.dias_entrega_estimados;
  const horas = result.estimation.horas_totales_ajustadas;
  const compl = result.analysis.complejidad;
  const usuarios = result.estimation.usuarios_concurrentes.toLocaleString();
  const features = result.analysis.features
    .slice(0, 8)
    .map((f) => `• ${f}`)
    .join("\n");

  return [
    "Hola, quiero avanzar con el presupuesto que generé en la web:",
    "",
    `Tipo de proyecto: ${tipo}`,
    `Inversión estimada (USD / dólares estadounidenses): ${precio}`,
    `Entrega estimada: ${dias} días`,
    `Horas ajustadas: ${horas} hs`,
    `Complejidad: ${compl}`,
    `Usuarios concurrentes (est.): ${usuarios}`,
    "",
    "Funciones / prioridades detectadas:",
    features || "• (sin listado)",
    "",
    "¿Me escriben para coordinar?",
  ].join("\n");
}

export function getWhatsappBudgetUrl(
  phoneE164: string,
  result: AnalyzeResponse,
): string {
  const text = buildWhatsappBudgetMessage(result);
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(text)}`;
}

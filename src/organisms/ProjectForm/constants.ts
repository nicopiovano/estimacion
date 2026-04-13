import type { ProjectFormData } from "./ProjectForm.types";

/** Tooltip del micrófono deshabilitado (paso descripción) cuando no hay Web Speech API. */
export const MIC_UNAVAILABLE_TOOLTIP =
  "Tu navegador no permite dictado por voz en esta página. Podés escribir tu idea en el cuadro de texto.";

/** Snackbar informativo cuando el dictado no está disponible. */
export const MIC_SNACKBAR_MESSAGE =
  "El navegador no permite dictado por voz en esta página. Podés escribir tu idea en el cuadro de texto.";

export const PLATAFORMA_OPTIONS = [
  {
    value: "web",
    label: "Sitio web",
    desc: "Accesible desde cualquier navegador, sin instalación.",
  },
  {
    value: "app",
    label: "App",
    desc: "Aplicación para celular o tablet (iOS / Android).",
  },
  {
    value: "ambas",
    label: "Ambas",
    desc: "Presencia web y app móvil combinadas.",
  },
] as const;

export const PUBLICO_OPTIONS = [
  {
    value: "personas",
    label: "Para mí",
    desc: "Servicio personal para uso individual.",
  },
  {
    value: "emprendimiento",
    label: "Emprendimiento",
    desc: "Soluciones para emprendedores y pequeñas empresas.",
  },
  {
    value: "profesionales",
    label: "Profesionales",
    desc: "Servicios pensados para independientes y especialistas.",
  },
  {
    value: "tiendas",
    label: "Comercio",
    desc: "Operaciones, ventas y catálogos para tiendas o vendedores.",
  },
] as const;

/** Paso 3 para emprendimiento / comercio */
export const VOLUMEN_OPTIONS = [
  {
    value: "menos_100",
    label: "Menos de 100",
    desc: "Visitas o ventas al mes, negocio en etapa inicial.",
  },
  {
    value: "100_1000",
    label: "100 a 1.000",
    desc: "Flujo moderado, ya con cierta tracción.",
  },
  {
    value: "1000_10000",
    label: "1.000 a 10.000",
    desc: "Negocio en crecimiento con demanda constante.",
  },
  {
    value: "mas_10000",
    label: "Más de 10.000",
    desc: "Alto volumen, requiere infraestructura robusta.",
  },
] as const;

/** Paso 3 para profesionales / uso personal */
export const FIN_OPTIONS = [
  {
    value: "lucrativo",
    label: "Fines lucrativos",
    desc: "El proyecto busca generar ingresos o rentabilidad.",
  },
  {
    value: "educativo",
    label: "Fines educativos",
    desc: "Orientado al aprendizaje, formación o divulgación.",
  },
  {
    value: "salud",
    label: "Orientado a la salud",
    desc: "Bienestar, medicina, psicología u otras áreas afines.",
  },
  {
    value: "mas_adelante",
    label: "Te cuento más adelante",
    desc: "Prefiero explicarlo en la descripción del proyecto.",
  },
] as const;

export const MODELO_OPTIONS = [
  {
    value: "suscripcion",
    label: "Pago mensual",
    desc: "Los usuarios pagan cada mes para seguir usando.",
  },
  {
    value: "pago_unico",
    label: "Pago único",
    desc: "Se paga una sola vez para tener acceso.",
  },
  {
    value: "gratuito",
    label: "Gratis",
    desc: "Sin costo directo; se monetiza por otro canal.",
  },
  {
    value: "no_se",
    label: "No lo sé aún",
    desc: "Primero querés estimar el costo antes de decidir.",
  },
] as const;

export const CUANDO_OPTIONS = [
  { value: "ya", label: "Lo antes posible", desc: "4 a 7 días" },
  { value: "semanas", label: "En unas semanas", desc: "8 a 14 días" },
  { value: "sin_apuro", label: "Sin apuro", desc: "15 a 20 días" },
  {
    value: "solo_costo",
    label: "Solo quiero saber el costo",
    desc: " ",
  },
] as const;

export const QUESTION_ORDER: Array<keyof ProjectFormData> = [
  "plataforma",
  "publico",
  "contexto",
  "modelo_negocio",
  "cuando",
  "descripcion",
];

/** Pasos cuyo contenido es fijo (no dependen del estado del form). */
export const STEP_CONTENT = [
  {
    title: "¿Qué tipo de producto digital necesitás?",
    description:
      "Elegí la superficie donde tu proyecto va a vivir.",
    eyebrow: "Paso 1 de 6",
  },
  {
    title: "¿A quién va destinado?",
    description:
      "Seleccioná la categoría que mejor describa al destinatario final de este servicio.",
    eyebrow: "Paso 2 de 6",
  },
  // Paso 3 se renderiza dinámicamente según el valor de `publico`
  null,
  {
    title: "¿Cómo generaría ingresos?",
    description:
      "No hace falta que esté cerrado, pero ayuda a estimar valor y proyección.",
    eyebrow: "Paso 4 de 6",
  },
  {
    title: "¿Cuándo te gustaría mover esto?",
    description:
      "La urgencia impacta directamente en alcance, tiempos y costo estimado.",
    eyebrow: "Paso 5 de 6",
  },
  {
    title: "¿Qué estás imaginando construir?",
    description:
      "Ahora sí: podés contarlo por escrito o grabar un audio para darnos el contexto final del proyecto.",
    eyebrow: "Paso 6 de 6",
  },
] as const;

/** Contenido dinámico del paso 3 según el público elegido. */
export function getContextoStepContent(publico: string) {
  if (publico === "emprendimiento" || publico === "tiendas") {
    return {
      title: "¿Cuánto tráfico o ventas manejás hoy?",
      description:
        "Nos ayuda a dimensionar la infraestructura y el costo real del proyecto.",
      eyebrow: "Paso 3 de 6",
    };
  }
  return {
    title: "¿Cuál es el propósito principal del proyecto?",
    description:
      "Esto nos permite ajustar el enfoque técnico y las prioridades de desarrollo.",
    eyebrow: "Paso 3 de 6",
  };
}

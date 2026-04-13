export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

/** Formato internacional sin + ni espacios (wa.me), AR móvil 11 7059-2784 → 5491170592784 */
export const WHATSAPP_PHONE_E164 = "5491170592784";

export const IDEA_PLATAFORMA_LABELS: Record<string, string> = {
  web: "sitio web",
  app: "aplicación móvil",
  ambas: "sitio web y aplicación móvil",
};

/** Textos alineados con `PUBLICO_OPTIONS` (ProjectForm) para el texto enviado al análisis. */
export const IDEA_PUBLICO_LABELS: Record<string, string> = {
  personas: "uso personal / para mí",
  emprendimiento: "emprendedores y pequeñas empresas",
  profesionales: "profesionales independientes",
  tiendas: "comercio, tiendas o vendedores",
};

/** Textos para el paso 3 de volumen (emprendimiento/comercio). */
export const IDEA_VOLUMEN_LABELS: Record<string, string> = {
  menos_100: "menos de 100 visitas/ventas al mes (etapa inicial)",
  "100_1000": "entre 100 y 1.000 visitas/ventas al mes",
  "1000_10000": "entre 1.000 y 10.000 visitas/ventas al mes",
  mas_10000: "más de 10.000 visitas/ventas al mes (alto volumen)",
};

/** Textos para el paso 3 de fin de proyecto (profesionales/personas). */
export const IDEA_FIN_LABELS: Record<string, string> = {
  lucrativo: "fines lucrativos (generar ingresos)",
  educativo: "fines educativos o de divulgación",
  salud: "orientado a la salud o bienestar",
  mas_adelante: "propósito a definir (se detalla en la descripción)",
};

export const IDEA_MODELO_LABELS: Record<string, string> = {
  pago_unico: "pago único",
  gratuito: "gratuita",
  no_se: "modelo de negocio a definir",
};

/** Textos alineados con `CUANDO_OPTIONS` (ProjectForm). */
export const IDEA_CUANDO_LABELS: Record<string, string> = {
  ya: "lo antes posible (aprox. 4 a 7 días)",
  semanas: "en unas semanas (aprox. 8 a 14 días)",
  sin_apuro: "sin apuro (aprox. 15 a 20 días)",
  solo_costo: "solo quiere saber el costo estimado",
};

/** Gastos extra que siempre aplican (dominio + hosting). */
export const GASTOS_EXTRA_BASE = [
  { label: "Dominio (.com)", value: "~U$S15 / año" },
  { label: "Hosting web", value: "desde U$S60 / año" },
] as const;

/** Gastos extra solo cuando el proyecto incluye app móvil. */
export const GASTOS_EXTRA_APP = [
  { label: "Apple Developer (App Store)", value: "U$S99 / año" },
  { label: "Google Play (Play Store)", value: "U$S25 único" },
] as const;

/** Etiquetas cortas para mostrar en el resumen de resultados. */
export const CUANDO_DISPLAY_LABELS: Record<string, string> = {
  ya: "4 a 7 días",
  semanas: "8 a 14 días",
  sin_apuro: "15 a 20 días",
  solo_costo: "A confirmar",
};

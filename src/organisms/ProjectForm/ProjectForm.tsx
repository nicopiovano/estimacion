import { useEffect, useRef, useState } from "react";
import { Button } from "../../atoms/Button/Button";
import {
  CUANDO_OPTIONS,
  FIN_OPTIONS,
  MIC_SNACKBAR_MESSAGE,
  MIC_UNAVAILABLE_TOOLTIP,
  MODELO_OPTIONS,
  PLATAFORMA_OPTIONS,
  PUBLICO_OPTIONS,
  QUESTION_ORDER,
  STEP_CONTENT,
  VOLUMEN_OPTIONS,
  getContextoStepContent,
} from "./constants";
import styles from "./ProjectForm.module.css";
import type { ProjectFormData } from "./ProjectForm.types";

export type { ProjectFormData } from "./ProjectForm.types";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  loading?: boolean;
  initialDescription?: string;
  initialData?: Partial<ProjectFormData>;
  onBack?: () => void;
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.31 6-6.72h-1.7z"
      />
    </svg>
  );
}

export function ProjectForm({
  onSubmit,
  loading = false,
  initialDescription = "",
  initialData,
  onBack,
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({
    descripcion: initialData?.descripcion ?? initialDescription,
    publico: initialData?.publico ?? "",
    plataforma: initialData?.plataforma ?? "",
    contexto: initialData?.contexto ?? "",
    modelo_negocio: initialData?.modelo_negocio ?? "",
    precio_cobro: initialData?.precio_cobro ?? "",
    cuando: initialData?.cuando ?? "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectFormData, string>>
  >({});
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRecordRef = useRef(false);

  const speechRecognitionApi =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const currentField = QUESTION_ORDER[currentStep];

  const isVolumenStep =
    currentField === "contexto" &&
    (form.publico === "emprendimiento" || form.publico === "tiendas");

  const contextoOptions = isVolumenStep ? VOLUMEN_OPTIONS : FIN_OPTIONS;
  const contextoStepContent = getContextoStepContent(form.publico);

  useEffect(() => {
    if (!initialDescription.trim()) return;
    setForm((current) => ({ ...current, descripcion: initialDescription }));
  }, [initialDescription]);

  const progress = ((currentStep + 1) / QUESTION_ORDER.length) * 100;

  const stepContent =
    currentField === "contexto"
      ? contextoStepContent
      : STEP_CONTENT[currentStep];

  function startRecognition() {
    if (!speechRecognitionApi) return;
    const rec = new speechRecognitionApi();
    rec.lang = "es-AR";
    rec.continuous = true;
    rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript;
        }
      }
      if (!finalText) return;
      setForm((prev) => ({
        ...prev,
        descripcion: `${prev.descripcion} ${finalText}`.trim(),
      }));
      clearError("descripcion");
    };
    rec.onend = () => {
      if (shouldRecordRef.current) {
        startRecognition();
      } else {
        setIsRecording(false);
      }
    };
    rec.start();
    recognitionRef.current = rec;
  }

  function toggleRecording() {
    if (!speechRecognitionApi) return;
    if (isRecording) {
      shouldRecordRef.current = false;
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    shouldRecordRef.current = true;
    setIsRecording(true);
    startRecognition();
  }

  function clearError(key: keyof ProjectFormData) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function goToNextStep() {
    setCurrentStep((step) =>
      step < QUESTION_ORDER.length - 1 ? step + 1 : step,
    );
  }

  function selectSingleOption(
    field: keyof ProjectFormData,
    value: string,
    extraReset?: Partial<ProjectFormData>,
  ) {
    setForm((prev) => ({ ...prev, [field]: value, ...extraReset }));
    clearError(field);
    goToNextStep();
  }

  function selectCuando(value: string) {
    if (isRecording) {
      shouldRecordRef.current = false;
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    selectSingleOption("cuando", value);
  }

  function validateStep(field: keyof ProjectFormData): boolean {
    let errorMessage: string | undefined;

    if (field === "descripcion" && !form.descripcion.trim()) {
      errorMessage = "Contanos al menos brevemente tu idea.";
    }
    if (field === "publico" && !form.publico) {
      errorMessage = "Elegí a quién va dirigida.";
    }
    if (field === "plataforma" && !form.plataforma) {
      errorMessage = "Seleccioná una opción.";
    }
    if (field === "contexto" && !form.contexto) {
      errorMessage = "Elegí una opción para continuar.";
    }
    if (field === "modelo_negocio" && !form.modelo_negocio) {
      errorMessage = "Elegí cómo vas a ganar dinero.";
    }
    if (field === "cuando" && !form.cuando) {
      errorMessage = "Elegí cuándo la necesitás.";
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(currentField)) return;

    if (currentStep === QUESTION_ORDER.length - 1) {
      onSubmit(form);
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function handleBack() {
    if (currentStep === 0) {
      onBack?.();
      return;
    }
    setCurrentStep((step) => step - 1);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.progressHeader}>
        <div className={styles.progressMeta}>
          <span className={styles.eyebrow}>{stepContent?.eyebrow}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <h2 className={styles.title}>{stepContent?.title}</h2>
          <p className={styles.description}>{stepContent?.description}</p>
        </div>

        {/* Paso 1: plataforma */}
        {currentField === "plataforma" && (
          <div className={styles.optionGrid}>
            {PLATAFORMA_OPTIONS.map((option, index) => (
              <Button
                key={option.value}
                type="button"
                variant="unstyled"
                className={`${styles.optionCard} ${
                  form.plataforma === option.value
                    ? styles.optionCardActive
                    : ""
                }`}
                onClick={() => selectSingleOption("plataforma", option.value)}
              >
                <span className={styles.optionIcon}>{index + 1}</span>
                <strong className={styles.optionLabel}>{option.label}</strong>
                <span className={styles.optionDesc}>{option.desc}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Paso 2: público */}
        {currentField === "publico" && (
          <div className={styles.optionGrid}>
            {PUBLICO_OPTIONS.map((option, index) => (
              <Button
                key={option.value}
                type="button"
                variant="unstyled"
                className={`${styles.optionCard} ${
                  form.publico === option.value ? styles.optionCardActive : ""
                }`}
                onClick={() =>
                  // Al cambiar público, resetear contexto porque las opciones cambian
                  selectSingleOption("publico", option.value, { contexto: "" })
                }
              >
                <span className={styles.optionIcon}>{index + 1}</span>
                <strong className={styles.optionLabel}>{option.label}</strong>
                <span className={styles.optionDesc}>{option.desc}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Paso 3: contexto (dinámico) */}
        {currentField === "contexto" && (
          <div className={styles.optionGrid}>
            {contextoOptions.map((option, index) => (
              <Button
                key={option.value}
                type="button"
                variant="unstyled"
                className={`${styles.optionCard} ${
                  form.contexto === option.value ? styles.optionCardActive : ""
                }`}
                onClick={() => selectSingleOption("contexto", option.value)}
              >
                <span className={styles.optionIcon}>{index + 1}</span>
                <strong className={styles.optionLabel}>{option.label}</strong>
                <span className={styles.optionDesc}>{option.desc}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Paso 4: modelo de negocio */}
        {currentField === "modelo_negocio" && (
          <div className={styles.optionGrid}>
            {MODELO_OPTIONS.map((option, index) => (
              <Button
                key={option.value}
                type="button"
                variant="unstyled"
                className={`${styles.optionCard} ${
                  form.modelo_negocio === option.value
                    ? styles.optionCardActive
                    : ""
                }`}
                onClick={() =>
                  selectSingleOption("modelo_negocio", option.value, {
                    precio_cobro:
                      option.value === "suscripcion" ? form.precio_cobro : "",
                  })
                }
              >
                <span className={styles.optionIcon}>{index + 1}</span>
                <strong className={styles.optionLabel}>{option.label}</strong>
                <span className={styles.optionDesc}>{option.desc}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Paso 5: cuándo */}
        {currentField === "cuando" && (
          <div className={styles.stack}>
            <div className={styles.optionGrid}>
              {CUANDO_OPTIONS.map((option, index) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="unstyled"
                  className={`${styles.optionCard} ${
                    form.cuando === option.value ? styles.optionCardActive : ""
                  }`}
                  onClick={() => selectCuando(option.value)}
                >
                  <span className={styles.optionIcon}>{index + 1}</span>
                  <strong className={styles.optionLabel}>{option.label}</strong>
                  <span className={styles.optionDesc}>{option.desc}</span>
                </Button>
              ))}
            </div>

            {speechRecognitionApi ? (
              <div className={styles.audioAssist}>
                <div className={styles.audioAssistCopy}>
                  <strong className={styles.audioAssistTitle}>
                    ¿Preferís adelantarnos el contexto por audio?
                  </strong>
                  <p className={styles.audioAssistText}>
                    Podés grabarlo ahora mismo y lo dejamos precargado para el
                    siguiente paso.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="unstyled"
                  className={`${styles.audioAssistButton} ${
                    isRecording ? styles.audioAssistButtonActive : ""
                  }`}
                  onClick={toggleRecording}
                >
                  {isRecording ? "Detener grabación" : "Grabar audio"}
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {/* Paso 6: descripción */}
        {currentField === "descripcion" && (
          <div className={styles.fieldArea}>
            <div className={styles.textareaWrap}>
              <textarea
                className={`${styles.textarea} ${
                  errors.descripcion ? styles.fieldError : ""
                }`}
                value={form.descripcion}
                onChange={(event) => {
                  const value = event.target.value.slice(0, 400);
                  setForm((prev) => ({ ...prev, descripcion: value }));
                  clearError("descripcion");
                }}
                rows={7}
                maxLength={400}
                placeholder="Ej: Tengo una veterinaria y quiero que los clientes puedan pedir turnos, pagar online y recibir recordatorios automáticamente."
              />
              {speechRecognitionApi ? (
                <Button
                  type="button"
                  variant="unstyled"
                  className={`${styles.voiceFab} ${
                    isRecording ? styles.voiceFabActive : ""
                  }`}
                  onClick={toggleRecording}
                  aria-pressed={isRecording}
                  aria-label={
                    isRecording
                      ? "Detener micrófono"
                      : "Activar micrófono para dictar"
                  }
                  title={
                    isRecording
                      ? "Detener micrófono"
                      : "Dictar con el micrófono"
                  }
                >
                  <MicIcon className={styles.voiceFabIcon} />
                </Button>
              ) : (
                <span
                  className={styles.micTooltipHostFab}
                  title={MIC_SNACKBAR_MESSAGE}
                >
                  <Button
                    type="button"
                    variant="unstyled"
                    disabled
                    className={styles.voiceFabDisabled}
                    aria-label={MIC_UNAVAILABLE_TOOLTIP}
                  >
                    <MicIcon className={styles.voiceFabIcon} />
                  </Button>
                </span>
              )}
            </div>

            <p
              className={`${styles.charCounter} ${
                form.descripcion.length >= 400 ? styles.charCounterMax : ""
              }`}
            >
              {form.descripcion.length}/400
            </p>

            {speechRecognitionApi && isRecording ? (
              <p className={styles.recordingHint}>
                <span className={styles.recordingDot} aria-hidden />
                Escuchando… el texto aparece en el cuadro.
              </p>
            ) : null}
          </div>
        )}

        {errors[currentField] && (
          <p className={styles.error}>{errors[currentField]}</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="unstyled"
          className={styles.backButton}
          onClick={handleBack}
        >
          ← Atrás
        </Button>

        {currentField === "descripcion" ? (
          <Button type="submit" loading={loading} size="lg">
            Cotizar idea
          </Button>
        ) : null}
      </div>
    </form>
  );
}

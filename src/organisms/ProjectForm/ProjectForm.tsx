import { useState, useRef } from 'react';
import { Button } from '../../atoms/Button/Button';
import styles from './ProjectForm.module.css';

export interface ProjectFormData {
  descripcion: string;
  publico: string;
  plataforma: string[];
  modelo_negocio: string;
  precio_cobro: string;
  cuando: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  loading?: boolean;
}

const PUBLICO_OPTIONS = [
  { value: 'empresas',      label: 'Empresas o negocios',        icon: '🏢' },
  { value: 'personas',      label: 'Personas en general',         icon: '👥' },
  { value: 'profesionales', label: 'Profesionales independientes', icon: '💼' },
  { value: 'tiendas',       label: 'Tiendas o vendedores',         icon: '🛒' },
];

const PLATAFORMA_OPTIONS = [
  { value: 'celular',      label: 'Celular',      icon: '📱' },
  { value: 'computadora',  label: 'Computadora',  icon: '💻' },
];

const MODELO_OPTIONS = [
  { value: 'suscripcion', icon: '🔄', label: 'Pago mensual',   desc: 'Los usuarios pagan cada mes para seguir usando' },
  { value: 'pago_unico',  icon: '💳', label: 'Pago único',     desc: 'Se paga una sola vez para tener acceso' },
  { value: 'gratuito',    icon: '🎁', label: 'Gratis',         desc: 'Sin costo (publicidad, donaciones u otro)' },
  { value: 'no_se',       icon: '🤔', label: 'No lo sé aún',   desc: 'Quiero saber el costo de desarrollo primero' },
];

const CUANDO_OPTIONS = [
  { value: 'ya',        label: 'Lo antes posible',         desc: '1-2 meses' },
  { value: 'meses',     label: 'En unos meses',            desc: '3-6 meses' },
  { value: 'sin_apuro', label: 'Sin apuro',                desc: '6-12 meses' },
  { value: 'solo_costo',label: 'Solo quiero saber el costo', desc: 'Sin fecha definida' },
];

export function ProjectForm({ onSubmit, loading = false }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({
    descripcion: '',
    publico: '',
    plataforma: [],
    modelo_negocio: '',
    precio_cobro: '',
    cuando: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;

  function toggleRecording() {
    if (!SpeechRecognitionAPI) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const rec = new SpeechRecognitionAPI();
    rec.lang = 'es-AR';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const parts: string[] = [];
      for (let i = 0; i < e.results.length; i++) {
        parts.push(e.results[i][0].transcript);
      }
      const text = parts.join(' ');
      setForm(prev => ({ ...prev, descripcion: (prev.descripcion + ' ' + text).trim() }));
      clearError('descripcion');
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
  }

  function togglePlataforma(val: string) {
    setForm(prev => {
      const exists = prev.plataforma.includes(val);
      return { ...prev, plataforma: exists ? prev.plataforma.filter(v => v !== val) : [...prev.plataforma, val] };
    });
    clearError('plataforma');
  }

  function clearError(key: keyof ProjectFormData) {
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof ProjectFormData, string>> = {};
    if (!form.descripcion.trim()) next.descripcion = 'Contanos al menos brevemente tu idea.';
    if (!form.publico) next.publico = 'Elegí a quién va dirigida.';
    if (form.plataforma.length === 0) next.plataforma = 'Seleccioná al menos una opción.';
    if (!form.modelo_negocio) next.modelo_negocio = 'Elegí cómo vas a ganar dinero.';
    if (!form.cuando) next.cuando = 'Elegí cuándo la necesitás.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* P1: Descripción */}
      <div className={styles.question}>
        <div className={styles.questionHeader}>
          <span className={styles.qNum}>1</span>
          <div>
            <h3 className={styles.qLabel}>¿Cuál es tu idea y qué problema resuelve?</h3>
            <p className={styles.qHint}>Contanos con tus palabras. No hace falta saber de tecnología.</p>
          </div>
        </div>
        <div className={styles.textareaWrapper}>
          <textarea
            className={`${styles.textarea} ${errors.descripcion ? styles.textareaError : ''}`}
            value={form.descripcion}
            onChange={e => { setForm(prev => ({ ...prev, descripcion: e.target.value })); clearError('descripcion'); }}
            placeholder="Ej: Tengo una veterinaria y pierdo mucho tiempo coordinando turnos por WhatsApp. Quiero que los clientes puedan sacar turno solos desde el celular..."
            rows={5}
          />
          {SpeechRecognitionAPI && (
            <button
              type="button"
              className={`${styles.micBtn} ${isRecording ? styles.micBtnActive : ''}`}
              onClick={toggleRecording}
              title={isRecording ? 'Detener grabación' : 'Hablar en lugar de escribir'}
            >
              {isRecording ? '⏹ Grabando...' : '🎙 Hablar'}
            </button>
          )}
        </div>
        {errors.descripcion && <p className={styles.error}>{errors.descripcion}</p>}
      </div>

      {/* P2: Público */}
      <div className={styles.question}>
        <div className={styles.questionHeader}>
          <span className={styles.qNum}>2</span>
          <div>
            <h3 className={styles.qLabel}>¿A quién va dirigida?</h3>
            <p className={styles.qHint}>¿Quién va a usar o comprar lo que estás construyendo?</p>
          </div>
        </div>
        <div className={styles.chipRow}>
          {PUBLICO_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.chip} ${form.publico === opt.value ? styles.chipOn : ''}`}
              onClick={() => { setForm(prev => ({ ...prev, publico: opt.value })); clearError('publico'); }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        {errors.publico && <p className={styles.error}>{errors.publico}</p>}
      </div>

      {/* P3: Plataforma */}
      <div className={styles.question}>
        <div className={styles.questionHeader}>
          <span className={styles.qNum}>3</span>
          <div>
            <h3 className={styles.qLabel}>¿Dónde lo van a usar?</h3>
            <p className={styles.qHint}>Podés elegir más de una opción.</p>
          </div>
        </div>
        <div className={styles.chipRow}>
          {PLATAFORMA_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.chip} ${form.plataforma.includes(opt.value) ? styles.chipOn : ''}`}
              onClick={() => togglePlataforma(opt.value)}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        {errors.plataforma && <p className={styles.error}>{errors.plataforma}</p>}
      </div>

      {/* P4: Modelo de negocio */}
      <div className={styles.question}>
        <div className={styles.questionHeader}>
          <span className={styles.qNum}>4</span>
          <div>
            <h3 className={styles.qLabel}>¿Cómo vas a ganar dinero?</h3>
            <p className={styles.qHint}>No te preocupes si aún no lo tenés claro.</p>
          </div>
        </div>
        <div className={styles.modelGrid}>
          {MODELO_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.modelCard} ${form.modelo_negocio === opt.value ? styles.modelCardOn : ''}`}
              onClick={() => { setForm(prev => ({ ...prev, modelo_negocio: opt.value })); clearError('modelo_negocio'); }}
            >
              <span className={styles.modelIcon}>{opt.icon}</span>
              <span className={styles.modelLabel}>{opt.label}</span>
              <span className={styles.modelDesc}>{opt.desc}</span>
            </button>
          ))}
        </div>
        {form.modelo_negocio === 'suscripcion' && (
          <div className={styles.priceBox}>
            <label className={styles.priceLabel}>¿Cuánto pensás cobrar por mes?</label>
            <div className={styles.priceRow}>
              <span className={styles.priceSym}>$</span>
              <input
                type="number"
                className={styles.priceField}
                value={form.precio_cobro}
                onChange={e => setForm(prev => ({ ...prev, precio_cobro: e.target.value }))}
                placeholder="29"
                min="0"
              />
              <span className={styles.priceUnit}>USD por persona / mes</span>
            </div>
          </div>
        )}
        {errors.modelo_negocio && <p className={styles.error}>{errors.modelo_negocio}</p>}
      </div>

      {/* P5: Cuándo */}
      <div className={styles.question}>
        <div className={styles.questionHeader}>
          <span className={styles.qNum}>5</span>
          <div>
            <h3 className={styles.qLabel}>¿Para cuándo lo necesitás?</h3>
            <p className={styles.qHint}>El tiempo disponible afecta el costo y el alcance.</p>
          </div>
        </div>
        <div className={styles.chipRow}>
          {CUANDO_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.chip} ${styles.chipStack} ${form.cuando === opt.value ? styles.chipOn : ''}`}
              onClick={() => { setForm(prev => ({ ...prev, cuando: opt.value })); clearError('cuando'); }}
            >
              <span className={styles.chipMain}>{opt.label}</span>
              <span className={styles.chipSub}>{opt.desc}</span>
            </button>
          ))}
        </div>
        {errors.cuando && <p className={styles.error}>{errors.cuando}</p>}
      </div>

      <Button type="submit" loading={loading} size="lg" fullWidth>
        {loading ? 'Analizando tu idea...' : 'Obtener mi estimación →'}
      </Button>
    </form>
  );
}

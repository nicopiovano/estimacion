import styles from './WizardTemplate.module.css';

interface WizardStep {
  label: string;
}

interface WizardTemplateProps {
  steps: WizardStep[];
  currentStep: number;
  children: React.ReactNode;
  title?: string;
}

export function WizardTemplate({ steps, currentStep, children, title }: WizardTemplateProps) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {title && <h1 className={styles.title}>{title}</h1>}

        <nav className={styles.stepper} aria-label="Pasos del asistente">
          {steps.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${active ? styles.activeLabel : ''}`}>{step.label}</span>
                {i < steps.length - 1 && <div className={`${styles.connector} ${done ? styles.connectorDone : ''}`} />}
              </div>
            );
          })}
        </nav>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullPage?: boolean;
}

export function Loader({ size = 'md', label = 'Cargando...', fullPage = false }: LoaderProps) {
  const content = (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className={styles.overlay}>{content}</div>;
  }

  return content;
}

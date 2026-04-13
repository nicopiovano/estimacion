import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export function Card({ children, title, subtitle, className = '', padding = 'md', elevated = false }: CardProps) {
  return (
    <div className={[styles.card, styles[padding], elevated ? styles.elevated : '', className].join(' ')}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}

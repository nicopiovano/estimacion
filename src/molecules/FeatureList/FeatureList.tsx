import styles from './FeatureList.module.css';

interface FeatureListProps {
  features: string[];
  title?: string;
  emptyMessage?: string;
}

export function FeatureList({ features, title = 'Features detectadas', emptyMessage = 'No se detectaron features.' }: FeatureListProps) {
  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {features.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {features.map((feature, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.dot} />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

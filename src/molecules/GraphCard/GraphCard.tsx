import { Card } from '../../atoms/Card/Card';
import styles from './GraphCard.module.css';

interface GraphCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon?: React.ReactNode;
}

export function GraphCard({ title, subtitle, value, unit, trend, trendLabel, icon }: GraphCardProps) {
  return (
    <Card elevated className={styles.graphCard}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <span className={styles.cardTitle}>{title}</span>
          {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {trend && trendLabel && (
        <div className={`${styles.trend} ${styles[trend]}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {trendLabel}
        </div>
      )}
    </Card>
  );
}

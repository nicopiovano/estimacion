import styles from './DashboardTemplate.module.css';

interface DashboardTemplateProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardTemplate({ sidebar, header, children }: DashboardTemplateProps) {
  return (
    <div className={styles.layout}>
      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
      <div className={styles.main}>
        {header && <header className={styles.header}>{header}</header>}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

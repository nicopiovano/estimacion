import { FEATURES } from "./constants";
import styles from "./LandingFeatureSection.module.css";

export function LandingFeatureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Cómo funciona el presupuesto online</h2>
        <p className={styles.description}>
          Diseñamos presupuestos con Inteligencia Artificial, rápidos y
          precisos, para que tengas claridad y certeza desde el primer momento.
        </p>
      </div>

      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <article key={feature.title} className={styles.card}>
            <div className={styles.iconWrap}>{feature.icon}</div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardText}>{feature.description}</p>
            <span className={styles.cardFoot}>{feature.foot}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

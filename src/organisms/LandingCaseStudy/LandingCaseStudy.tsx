import styles from "./LandingCaseStudy.module.css";

export function LandingCaseStudy() {
  return (
    <section className={styles.section}>
      <div className={styles.imageColumn}>
        <div className={styles.glow} />
        <div className={styles.imageFrame}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAL9sxXF8VilgWzuvrcJ1ECoVvg3dVTUJwtjTIie_c6g8jroBkSptZggYCaIgeNo-wQe3vfORFLI3XE908LZ8vYgz9WBoPnxf23zbddPh_Ynz19fU4zBc1VD6g6lnuLsn5h9o5xUUMFANSvgQIXyzdnlkKxfzXUwBgf56dxWfIOfjrgFQddeWaOTWH6z0KQIPe-bPQWhNQeF9avt4PDnEHUmmb0GhrywN41lShTjDtbfibGUbvNcd2Vmsl8PIqamRlMsfLSWva9p8"
            alt="Aplicación financiera en smartphone"
          />
        </div>

        <div className={styles.floatingCard}>
          <div className={styles.statusRow}>
            <span className={styles.status}>Finalizado</span>
            <span className={styles.statusMeta}>Hace 2 días</span>
          </div>
          <p className={styles.projectName}>Proyecto: Fintech Flow</p>
        </div>
      </div>

      <div className={styles.copyColumn}>
        <span className={styles.eyebrow}>Caso de éxito</span>
        <h2 className={styles.title}>Elevando estándares digitales</h2>
        <p className={styles.description}>
          No solo hacemos webs, creamos experiencias inmersivas que respiran la
          identidad de tu marca. Nuestros sistemas priorizan calma y eficiencia.
        </p>
        {/* <a href="#" className={styles.link}>
          Ver portafolio completo <span>→</span>
        </a> */}
      </div>
    </section>
  );
}

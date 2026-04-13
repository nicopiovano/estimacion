import { Button } from "../../atoms/Button/Button";
import { AvatarCluster } from "../../molecules/AvatarCluster/AvatarCluster";
import { AVATARS, COLLAGE_IMAGES } from "./constants";
import styles from "./LandingHero.module.css";

interface LandingHeroProps {
  onStartQuote: () => void;
}

export function LandingHero({ onStartQuote }: LandingHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        {/* <div className={styles.badge}>
          <span className={styles.badgeIcon}>✦</span>
          <span>Atk. diseño con propósito</span>
        </div> */}

        <h1 className={styles.title}>
          Transforma tu idea
          <br />
          en realidad
        </h1>

        <p className={styles.description}>
          Explicanos tu proyecto y nosotros te lo cotizamos lo más rápido
          posible.
        </p>

        <div className={styles.actions}>
          <Button size="lg" onClick={onStartQuote}>
            <span className={styles.buttonIcon}>✎</span>
            Comenzar cotización
          </Button>
        </div>

        <div className={styles.socialProof}>
          <AvatarCluster avatars={AVATARS} />
          <p className={styles.socialText}>
            Únete a más de <strong>45+ creadores</strong> que ya presupuestaron.
          </p>
        </div>
      </div>

      <div className={styles.collage}>
        <div className={styles.mainImage}>
          <img src={COLLAGE_IMAGES[0].src} alt={COLLAGE_IMAGES[0].alt} />
        </div>
        <div className={styles.sideImages}>
          <div className={styles.sideImage}>
            <img src={COLLAGE_IMAGES[1].src} alt={COLLAGE_IMAGES[1].alt} />
          </div>
          <div className={styles.sideImage}>
            <img src={COLLAGE_IMAGES[2].src} alt={COLLAGE_IMAGES[2].alt} />
          </div>
        </div>
      </div>
    </section>
  );
}

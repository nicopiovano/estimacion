import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>Gratis · Sin registro · En minutos</span>
        <h1 className={styles.title}>
          Tenés una idea.<br />
          <span className={styles.gradient}>¿Cuánto cuesta hacerla?</span>
        </h1>
        <p className={styles.subtitle}>
          Respondé 5 preguntas sencillas sobre tu negocio y nuestra IA te dará
          un presupuesto de desarrollo y una proyección de lo que podés ganar.
          Sin tecnicismos. Sin formularios complicados.
        </p>
        <div className={styles.actions}>
          <Button size="lg" onClick={() => navigate('/project')}>
            Quiero saber el costo →
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/project')}>
            Ver ejemplo
          </Button>
        </div>
      </div>

      <div className={styles.features}>
        {[
          {
            icon: '💬',
            title: 'Contanos tu idea',
            desc: 'En tus palabras. Podés escribir o hablar. No hace falta saber de tecnología.',
          },
          {
            icon: '💰',
            title: 'Recibís un presupuesto',
            desc: 'Costo estimado de desarrollo, tiempo de entrega y qué incluye.',
          },
          {
            icon: '📈',
            title: 'Y una proyección a 12 meses',
            desc: 'Cuánto podrías ganar mes a mes si tu negocio crece como esperás.',
          },
        ].map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <p className={styles.footnote}>Powered by Claude AI · Solo para fines estimativos</p>
    </div>
  );
}

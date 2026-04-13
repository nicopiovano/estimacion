import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.desc}>
          La ruta que buscás no existe, cambió o ya no está disponible.
        </p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  );
}

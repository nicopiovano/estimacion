import { SITE_FOOTER_AUTHOR_NAME, SITE_FOOTER_PORTFOLIO_URL } from "./constants";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className = "" }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className}`.trim()}>
      <p className={styles.copy}>
        © {year}{" "}
        <a
          href={SITE_FOOTER_PORTFOLIO_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.copyLink}
        >
          {SITE_FOOTER_AUTHOR_NAME}
        </a>
      </p>
    </footer>
  );
}

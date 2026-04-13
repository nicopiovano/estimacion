import { useNavigate } from "react-router-dom";
import { LandingCaseStudy } from "../../organisms/LandingCaseStudy/LandingCaseStudy";
import { LandingFeatureSection } from "../../organisms/LandingFeatureSection/LandingFeatureSection";
import { LandingHero } from "../../organisms/LandingHero/LandingHero";
import { SiteFooter } from "../../organisms/SiteFooter/SiteFooter";
import styles from "./HomePage.module.css";

export function HomePage() {
  const navigate = useNavigate();

  function handleStartQuote() {
    navigate("/project");
  }

  return (
    <div className={styles.page}>
      <LandingHero onStartQuote={handleStartQuote} />
      <LandingFeatureSection />
      <LandingCaseStudy />
      <SiteFooter />
    </div>
  );
}

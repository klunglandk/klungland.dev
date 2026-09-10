import Icon from "../Icon/Icon";
import {
  EMAIL,
  GITHUB_REPO_URL,
  GITHUB_URL,
  LINKEDIN_LOGO_URL_LIGHT,
  LINKEDIN_URL,
} from "../../config/social";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-top"]}>
        <a
          className={styles["icon-chip"]}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <Icon icon="github" size={22} />
        </a>
        <a
          className={styles["icon-chip"]}
          href={LINKEDIN_URL || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <img src={LINKEDIN_LOGO_URL_LIGHT} alt="" width={22} height={22} />
        </a>
        <a
          className={styles["icon-chip"]}
          href={`mailto:${EMAIL}`}
          aria-label="Email"
          title="Email"
        >
          <Icon icon="email" size={22} />
        </a>
      </div>
      <div className={styles["footer-middle"]}>
        <span>© {new Date().getFullYear()} Kristine Klungland</span>
      </div>
      <div className={styles["footer-bottom"]}>
        <span>
          Built with React &amp; TypeScript ·{" "}
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </span>
      </div>
    </footer>
  );
}

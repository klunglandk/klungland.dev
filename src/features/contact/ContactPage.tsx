import { useState, type MouseEvent } from "react";
import Widget from "../../components/Widget/Widget";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import ContactItem from "./components/ContactItem";
import Grid from "../../components/Grid/Grid";
import {
  CV_EN_URL,
  CV_NO_URL,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_LOGO_URL,
  LINKEDIN_URL,
} from "../../config/social";
import styles from "./ContactPage.module.css";

export function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Widget title="Get in touch" type="large">
      <Grid type="col-2">
        <div className={styles["left-column"]}>
          <p>
            I finished my degree in computer engineering this June and I'm
            actively looking for my next role. Always happy to chat, whether
            it's about a specific opening or just to connect.
          </p>
          <div className={styles["status-badge"]}>
            <Icon icon="checkCircle" size={16} />
            Available from August 2026
          </div>
        </div>
        <div className={styles["right-column"]}>
          <div className={styles["contact-list"]}>
            <ContactItem
              icon="email"
              label="Email"
              value={EMAIL}
              href={`mailto:${EMAIL}`}
              action={
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email"
                >
                  <Icon icon={copied ? "checkCircle" : "copy"} size={18} />
                </button>
              }
            />
            <ContactItem
              iconImage={LINKEDIN_LOGO_URL}
              label="LinkedIn"
              value="linkedin.com/in/kristine-klungland-326698350"
              href={LINKEDIN_URL}
              external
            />
            <ContactItem
              icon="github"
              label="GitHub"
              value="github.com/klunglandk"
              href={GITHUB_URL}
              external
            />
          </div>
          <div className={styles.footer}>
            <div className={styles["cv-buttons"]}>
              <Button
                icon="download"
                label="Download CV (EN)"
                type="outline"
                href={CV_EN_URL}
              />
              <Button
                icon="download"
                label="Download CV (NO)"
                type="outline"
                href={CV_NO_URL}
              />
            </div>
          </div>
        </div>
      </Grid>
    </Widget>
  );
}

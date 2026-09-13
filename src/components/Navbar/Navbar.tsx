import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import { ROUTES } from "../../config/routes";
import { capitalize } from "../../utils/text";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { pathname } = useLocation();

  const projectTrail = pathname.startsWith("/projects/")
    ? pathname.split("/").filter(Boolean).slice(1)
    : [];

  return (
    <div className={styles["navbar-wrapper"]}>
      <Button
        label="Home"
        variant="ghost"
        href={ROUTES.home}
        active={pathname === ROUTES.home}
      />
      <Button
        label="About"
        variant="ghost"
        href={ROUTES.about}
        active={pathname === ROUTES.about}
      />
      {projectTrail.length > 0 ? (
        <div className={styles["nav-trail"]}>
          <Button
            label="Projects"
            href={ROUTES.projects}
            className={styles.trail}
          />
          {projectTrail.map((segment, i) => {
            const href = `/projects/${projectTrail.slice(0, i + 1).join("/")}`;
            const isActive = i === projectTrail.length - 1;
            return (
              <Fragment key={href}>
                <Icon icon="chevronRight" />
                <Button
                  label={capitalize(segment)}
                  href={href}
                  className={clsx(styles.trail, isActive && styles.active)}
                />
              </Fragment>
            );
          })}
        </div>
      ) : (
        <Button
          label="Projects"
          variant="ghost"
          href={ROUTES.projects}
          active={pathname.startsWith(ROUTES.projects)}
        />
      )}
      <Button
        label="Contact"
        variant="ghost"
        href={ROUTES.contact}
        active={pathname === ROUTES.contact}
      />
    </div>
  );
}

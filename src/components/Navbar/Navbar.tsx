import { Fragment } from "react";
import { useLocation } from "react-router-dom";
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
        type="navbar"
        href={ROUTES.home}
        active={pathname === ROUTES.home}
      />
      <Button
        label="About"
        type="navbar"
        href={ROUTES.about}
        active={pathname === ROUTES.about}
      />
      {projectTrail.length > 0 ? (
        <div className={styles["nav-trail"]}>
          <Button label="Projects" type="trail" href={ROUTES.projects} />
          {projectTrail.map((segment, i) => {
            const href = `/projects/${projectTrail.slice(0, i + 1).join("/")}`;
            return (
              <Fragment key={href}>
                <Icon icon="chevronRight" />
                <Button
                  label={capitalize(segment)}
                  type="trail"
                  href={href}
                  active={i === projectTrail.length - 1}
                />
              </Fragment>
            );
          })}
        </div>
      ) : (
        <Button
          label="Projects"
          type="navbar"
          href={ROUTES.projects}
          active={pathname.startsWith(ROUTES.projects)}
        />
      )}
      <Button
        label="Contact"
        type="navbar"
        href={ROUTES.contact}
        active={pathname === ROUTES.contact}
      />
    </div>
  );
}

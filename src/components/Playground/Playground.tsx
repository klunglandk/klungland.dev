import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type {
  PlaygroundControl,
  PlaygroundValues,
} from "../../types/playground";
import Grid from "../Grid/Grid";
import Card from "../Card/Card";
import styles from "./Playground.module.css";

interface PlaygroundProps {
  controls: PlaygroundControl[];
  description?: ReactNode;
  demoUrl?: string;
  children: (values: PlaygroundValues) => ReactNode;
}

export default function Playground({
  controls,
  description,
  demoUrl,
  children,
}: PlaygroundProps) {
  const [values, setValues] = useState<PlaygroundValues>(() =>
    Object.fromEntries(
      controls.map((control) => [control.id, control.defaultValue]),
    ),
  );

  const setValue = (id: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const themeControl = controls.find((control) => control.kind === "theme");
  const activeTheme = themeControl?.themes.find(
    (theme) => theme.value === values[themeControl.id],
  );

  return (
    <Grid type="col-2">
      {(description || demoUrl || controls.length > 0) && (
        <div className={styles.controls}>
          {(description || demoUrl) && (
            <div className={styles.about}>
              {description && <p>{description}</p>}
              {demoUrl && (
                <a href={demoUrl} target="_blank" rel="noreferrer">
                  Se live demo
                </a>
              )}
            </div>
          )}
          <Card type="controls">
            {controls.map((control) => (
              <PlaygroundField
                key={control.id}
                control={control}
                value={values[control.id]}
                onChange={(value) => setValue(control.id, value)}
              />
            ))}
          </Card>
        </div>
      )}
      <div className={styles.stage} style={activeTheme?.vars as CSSProperties}>
        {children(values)}
      </div>
    </Grid>
  );
}

function PlaygroundField({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  const fieldId = `playground-${control.id}`;

  if (control.kind === "toggle") {
    return (
      <label className={styles.field} htmlFor={fieldId}>
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{control.label}</span>
      </label>
    );
  }

  if (control.kind === "text") {
    return (
      <label className={styles.field} htmlFor={fieldId}>
        <span>{control.label}</span>
        <input
          id={fieldId}
          type="text"
          value={String(value)}
          placeholder={control.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  const options = control.kind === "theme" ? control.themes : control.options;

  return (
    <label className={styles.field} htmlFor={fieldId}>
      <span>{control.label}</span>
      <select
        id={fieldId}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

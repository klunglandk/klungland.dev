export type PlaygroundValues = Record<string, string | boolean>;

export interface PlaygroundToggleControl {
  kind: "toggle";
  id: string;
  label: string;
  defaultValue: boolean;
}

export interface PlaygroundSelectControl {
  kind: "select";
  id: string;
  label: string;
  defaultValue: string;
  options: { label: string; value: string }[];
}

export interface PlaygroundTextControl {
  kind: "text";
  id: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
}

export interface PlaygroundThemeOption {
  label: string;
  value: string;
  vars: Record<string, string>;
}

export interface PlaygroundThemeControl {
  kind: "theme";
  id: string;
  label: string;
  defaultValue: string;
  themes: PlaygroundThemeOption[];
}

export type PlaygroundControl =
  | PlaygroundToggleControl
  | PlaygroundSelectControl
  | PlaygroundTextControl
  | PlaygroundThemeControl;

import Playground from "../../../../../components/Playground/Playground";
import { useSvelteMount } from "../../../../../hooks/useSvelteMount.svelte.ts";
import type {
  PlaygroundControl,
  PlaygroundValues,
} from "../../../../../types/playground";
import { PLAYGROUND_PALETTES } from "../../utils/playgroundPalettes";
import MultiselectDemo from "./MultiselectDemo.svelte";

const THEME_CONTROL: PlaygroundControl = {
  kind: "theme",
  id: "theme",
  label: "Theme",
  defaultValue: "midnight",
  themes: Object.entries(PLAYGROUND_PALETTES).map(([value, palette]) => ({
    value,
    label: palette.label,
    vars: {
      "--playground-bg": palette.bg,
      "--playground-border": palette.border,
      "--multiselect-bg": palette.bg,
      "--multiselect-border-color": palette.border,
      "--multiselect-text": palette.text,
      "--multiselect-muted": palette.muted,
      "--multiselect-hover-bg": palette.hoverBg,
      "--multiselect-accent": palette.accent,
      "--multiselect-accent-strong": `color-mix(in oklch, ${palette.accent} 80%, black)`,
      "--multiselect-accent-contrast": palette.bg,
      "--multiselect-tag-bg": `color-mix(in oklch, ${palette.accent} 18%, transparent)`,
      "--multiselect-tag-text": palette.accent,
    },
  })),
};

const ALLOW_USER_OPTIONS_CONTROL: PlaygroundControl = {
  kind: "toggle",
  id: "allowUserOptions",
  label: "Allow user options",
  defaultValue: false,
};

const DISABLED_CONTROL: PlaygroundControl = {
  kind: "toggle",
  id: "disabled",
  label: "Disabled",
  defaultValue: false,
};

const SCROLL_X_CONTROL: PlaygroundControl = {
  kind: "toggle",
  id: "scrollX",
  label: "Scroll horizontally",
  defaultValue: true,
};

const SCROLL_Y_CONTROL: PlaygroundControl = {
  kind: "toggle",
  id: "scrollY",
  label: "Scroll vertically",
  defaultValue: true,
};

const MAX_SELECT_CONTROL: PlaygroundControl = {
  kind: "select",
  id: "maxSelect",
  label: "Max selections",
  defaultValue: "unbounded",
  options: [
    { label: "Unlimited", value: "unbounded" },
    { label: "1 (single select)", value: "1" },
    { label: "3", value: "3" },
  ],
};

const WIDTH_CONTROL: PlaygroundControl = {
  kind: "select",
  id: "width",
  label: "Width",
  defaultValue: "full",
  options: [
    { label: "Default width", value: "full" },
    { label: "16rem", value: "16rem" },
    { label: "24rem", value: "24rem" },
  ],
};

const HEIGHT_CONTROL: PlaygroundControl = {
  kind: "select",
  id: "height",
  label: "Dropdown height",
  defaultValue: "330",
  options: [
    { label: "330px (default)", value: "330" },
    { label: "150px", value: "150" },
    { label: "500px", value: "500" },
  ],
};

const PLACEHOLDER_CONTROL: PlaygroundControl = {
  kind: "text",
  id: "placeholder",
  label: "Placeholder text",
  defaultValue: "Select your favorite frameworks...",
};

const controls: PlaygroundControl[] = [
  THEME_CONTROL,
  ALLOW_USER_OPTIONS_CONTROL,
  DISABLED_CONTROL,
  MAX_SELECT_CONTROL,
  SCROLL_X_CONTROL,
  SCROLL_Y_CONTROL,
  WIDTH_CONTROL,
  HEIGHT_CONTROL,
  PLACEHOLDER_CONTROL,
];

const DESCRIPTION =
  "A multiselect component for Svelte 5, supporting search, keyboard navigation, select all and free text option creation.";

export default function SvelteMultiselect() {
  return (
    <Playground controls={controls} description={DESCRIPTION}>
      {(values) => <MultiselectStage values={values} />}
    </Playground>
  );
}

function toNullableNumber(value: string | boolean): number | null {
  return value === "unbounded" ? null : Number(value);
}

function toOptionalBoolean(value: string | boolean): boolean | undefined {
  if (value === "show") return true;
  if (value === "hide") return false;
  return undefined;
}

function MultiselectStage({ values }: { values: PlaygroundValues }) {
  const containerRef = useSvelteMount(MultiselectDemo, {
    allowUserOptions: Boolean(values.allowUserOptions),
    disabled: Boolean(values.disabled),
    loading: Boolean(values.loading),
    scrollX: Boolean(values.scrollX),
    scrollY: Boolean(values.scrollY),
    maxSelect: toNullableNumber(values.maxSelect),
    minSelect: Number(values.minSelect),
    maxOptions: toNullableNumber(values.maxOptions),
    selectAllOption: toOptionalBoolean(values.selectAllOption),
    width: values.width === "full" ? undefined : String(values.width),
    height: Number(values.height),
    placeholder: String(values.placeholder),
  });

  return <div ref={containerRef} />;
}

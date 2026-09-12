import Playground from "../../../../../components/Playground/Playground";
import { useSvelteMount } from "../../../../../hooks/useSvelteMount.svelte.ts";
import type {
  PlaygroundControl,
  PlaygroundValues,
} from "../../../../../types/playground";
import { PLAYGROUND_PALETTES } from "../../utils/playgroundPalettes";
import TooltipDemo from "./TooltipDemo.svelte";

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
      "--tooltip-bg": palette.bg,
      "--tooltip-color": palette.text,
      "--tooltip-border-color": palette.border,
    },
  })),
};

const TRIGGER_MODE_CONTROL: PlaygroundControl = {
  kind: "select",
  id: "triggerMode",
  label: "Trigger",
  defaultValue: "click",
  options: [
    { label: "Click", value: "click" },
    { label: "Hover", value: "hover" },
  ],
};

const MESSAGE_CONTROL: PlaygroundControl = {
  kind: "text",
  id: "message",
  label: "Tooltip text",
  defaultValue: "This is the content of the tooltip.",
  placeholder: "Type message...",
};

const controls: PlaygroundControl[] = [
  THEME_CONTROL,
  TRIGGER_MODE_CONTROL,
  MESSAGE_CONTROL,
];

const DESCRIPTION =
  "Boundary aware floating tooltip for Svelte 5, powered by @floating-ui/dom.";

export default function SvelteTooltip() {
  return (
    <Playground controls={controls} description={DESCRIPTION}>
      {(values) => <TooltipStage values={values} />}
    </Playground>
  );
}

function TooltipStage({ values }: { values: PlaygroundValues }) {
  const containerRef = useSvelteMount(TooltipDemo, {
    message: String(values.message),
    triggerMode: String(values.triggerMode),
  });

  return <div ref={containerRef} />;
}

import { useSvelteMount } from "../../../../../hooks/useSvelteMount";
import TooltipDemo from "./TooltipDemo.svelte";

export default function SvelteTooltip() {
  const containerRef = useSvelteMount(TooltipDemo);

  return (
    <div className="p-6 border border-gray-200 rounded-lg max-w-md mx-auto bg-white shadow-sm">
      {/* This is the boundary where Svelte will render live */}
      <div ref={containerRef} />
    </div>
  );
}

import { useSvelteMount } from "../../../../../hooks/useSvelteMount";
import MultiselectDemo from "./MultiselectDemo.svelte";

export default function SvelteMultiselect() {
    const containerRef = useSvelteMount(MultiselectDemo);

    return (
        <div className="p-6 border border-gray-200 rounded-lg max-w-md mx-auto bg-white shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Svelte Showcase</h3>

            {/* This is the boundary where Svelte will render live */}
            <div ref={containerRef} />
        </div>
    );
}

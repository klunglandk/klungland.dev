import { useEffect, useRef } from "react";
import { mount, unmount, type Component } from "svelte";

export function useSvelteMount(component: Component<Record<string, unknown>>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<ReturnType<typeof mount> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    componentRef.current = mount(component, {
      target: containerRef.current,
    });

    return () => {
      if (componentRef.current) {
        unmount(componentRef.current);
      }
    };
  }, [component]);

  return containerRef;
}

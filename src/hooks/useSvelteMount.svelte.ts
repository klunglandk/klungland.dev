import { useEffect, useRef } from "react";
import { mount, unmount, type Component } from "svelte";

function createReactiveProps(props: Record<string, unknown>) {
  const reactive = $state({ ...props });
  return reactive;
}

export function useSvelteMount(
  component: Component<Record<string, unknown>>,
  props: Record<string, unknown> = {},
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svelteProps = useRef<Record<string, unknown> | null>(null);
  if (svelteProps.current === null) svelteProps.current = createReactiveProps(props);

  // Mutate the reactive proxy so Svelte picks up new values without remounting.
  useEffect(() => {
    Object.assign(svelteProps.current!, props);
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = mount(component, {
      target: containerRef.current,
      props: svelteProps.current!,
    });

    return () => {
      unmount(instance);
    };
  }, [component]);

  return containerRef;
}

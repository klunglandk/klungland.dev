import { lazy, type ComponentType, type LazyExoticComponent } from "react";

interface ProjectEntry {
  title: string;
  description: string;
  component: LazyExoticComponent<ComponentType>;
}

export const ProjectRegistry: Record<string, Record<string, ProjectEntry>> = {
  svelte: {
    multiselect: {
      title: "Multiselect",
      description: "Søkbar flervalgs-dropdown med tastaturnavigasjon.",
      component: lazy(
        () => import("./svelte/components/multiselect/SvelteMultiselect"),
      ),
    },
    tooltip: {
      title: "Tooltip",
      description:
        "Tilgjengelig, posisjonerbar tooltip-komponent bygget fra bunnen.",
      component: lazy(
        () => import("./svelte/components/tooltip/SvelteTooltip"),
      ),
    },
  },
  react: {
    // legg til flere etter hvert som du bygger dem
  },
};

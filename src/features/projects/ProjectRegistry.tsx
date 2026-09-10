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
      description:
        "A multiselect component for Svelte 5, supporting search, keyboard navigation, select all and free text option creation",
      component: lazy(
        () => import("./svelte/components/multiselect/SvelteMultiselect"),
      ),
    },
    tooltip: {
      title: "Tooltip",
      description: "Boundary aware floating tooltip for Svelte 5",
      component: lazy(
        () => import("./svelte/components/tooltip/SvelteTooltip"),
      ),
    },
  },
  react: {
    // legg til flere etter hvert som du bygger dem
  },
};

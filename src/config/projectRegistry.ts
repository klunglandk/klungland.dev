import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { IconName } from "../types/icon";

export interface ProjectEntry {
  title: string;
  component: LazyExoticComponent<ComponentType>;
  addedAt: string;
  sourceUrl?: string;
  demoUrl?: string;
}

export const ProjectRegistry: Record<string, Record<string, ProjectEntry>> = {
  svelte: {
    multiselect: {
      title: "Multiselect",
      component: lazy(
        () =>
          import(
            "../features/projects/svelte/components/multiselect/SvelteMultiselect"
          ),
      ),
      addedAt: "2026-08-01",
    },
    tooltip: {
      title: "Tooltip",
      component: lazy(
        () =>
          import(
            "../features/projects/svelte/components/tooltip/SvelteTooltip"
          ),
      ),
      addedAt: "2026-08-20",
    },
  },
  react: {
    // legg til flere etter hvert som du bygger dem
  },
};

export interface ProjectCategoryMeta {
  key: string;
  title: string;
  icon: IconName;
  unit?: string;
}

export const PROJECT_CATEGORY_META: ProjectCategoryMeta[] = [
  { key: "react", title: "React", icon: "react", unit: "prosjekter" },
  { key: "svelte", title: "Svelte", icon: "svelte", unit: "components" },
  { key: "cpp", title: "C++", icon: "codeXml" },
  { key: "csharp", title: "C#", icon: "codeXml" },
  { key: "other", title: "Other", icon: "ellipsis" },
];

export function getCategoryCount(key: string): number {
  return Object.keys(ProjectRegistry[key] ?? {}).length;
}

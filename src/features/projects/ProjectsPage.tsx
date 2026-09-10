import Widget from "../../components/Widget/Widget";
import Card from "../../components/Card/Card";
import Grid from "../../components/Grid/Grid";
import { ProjectRegistry } from "./ProjectRegistry";
import type { IconName } from "../../types/icon";

interface CategoryCard {
  title: string;
  icon: IconName;
  href?: string;
  count?: number;
  unit?: string;
}

const categories: CategoryCard[] = [
  {
    title: "React",
    icon: "react",
    // href: "/projects/react",
    // count: Object.keys(ProjectRegistry.react ?? {}).length,
    unit: "prosjekter",
  },
  {
    title: "Svelte",
    icon: "svelte",
    href: "/projects/svelte",
    count: Object.keys(ProjectRegistry.svelte ?? {}).length,
    unit: "components",
  },
  { title: "C++", icon: "codeXml" },
  { title: "C#", icon: "codeXml" },
  { title: "Other", icon: "ellipsis" },
];

export function ProjectsPage() {
  return (
    <Widget title="Projects" type="large">
      A collection of things I've built over time as a student, during my time
      at Utel, and in whatever spare time was left over. Some started because an
      idea simply would not leave me alone. Others are more polished, a few are
      just proof-of-concepts. Either way, each one taught me something.
      <Grid type="col-3">
        {categories.map((category) => (
          <Card
            key={category.title}
            title={category.title}
            icon={category.icon}
            type="item"
            href={category.href}
            footer={
              category.count !== undefined
                ? `${category.count} ${category.unit}`
                : "Coming soon"
            }
          />
        ))}
      </Grid>
    </Widget>
  );
}

import Widget from "../../components/Widget/Widget";
import Card from "../../components/Card/Card";
import Grid from "../../components/Grid/Grid";
import {
  PROJECT_CATEGORY_META,
  getCategoryCount,
} from "../../config/projectRegistry";

export function ProjectsPage() {
  return (
    <Widget title="Projects" type="large">
      A collection of things I've built over time as a student, during my time
      at Utel, and in whatever spare time was left over. Some started because an
      idea simply would not leave me alone. Others are more polished, a few are
      just proof-of-concepts. Either way, each one taught me something.
      <Grid type="col-3">
        {PROJECT_CATEGORY_META.map((category) => {
          const count = getCategoryCount(category.key);
          return (
            <Card
              key={category.key}
              title={category.title}
              icon={category.icon}
              type="item"
              href={count > 0 ? `/projects/${category.key}` : undefined}
              footer={count > 0 ? `${count} ${category.unit}` : "Coming soon"}
            />
          );
        })}
      </Grid>
    </Widget>
  );
}

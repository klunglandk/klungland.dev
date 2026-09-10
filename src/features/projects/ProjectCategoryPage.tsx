import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import Grid from "../../components/Grid/Grid";
import Widget from "../../components/Widget/Widget";
import { capitalize } from "../../utils/text";
import { ProjectRegistry } from "./ProjectRegistry";

export function ProjectCategoryPage() {
  const { category } = useParams();
  const entries = category ? (ProjectRegistry[category] ?? {}) : {};
  const slugs = Object.keys(entries);

  return (
    <Widget title={`${capitalize(category ?? "")} projects`} type="large">
      {slugs.length > 0 ? (
        <Grid type="col-3">
          {slugs.map((slug) => (
            <Card
              key={slug}
              title={entries[slug].title}
              footer={entries[slug].description}
              icon="image"
              type="item"
              href={`/projects/${category}/${slug}`}
            />
          ))}
        </Grid>
      ) : (
        <p>No projects added for this category</p>
      )}
    </Widget>
  );
}

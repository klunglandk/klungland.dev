import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import Grid from "../../components/Grid/Grid";
import Widget from "../../components/Widget/Widget";
import { capitalize } from "../../utils/text";
import { ProjectRegistry, type ProjectEntry } from "../../config/projectRegistry";
import { useProjectData } from "../../hooks/useProjectData";
import { useProjectDocument } from "../../hooks/useProjectDocument";

export function ProjectCategoryPage() {
  const { category } = useParams();
  const entries = category ? (ProjectRegistry[category] ?? {}) : {};
  const slugs = Object.keys(entries);

  return (
    <Widget title={`${capitalize(category ?? "")} projects`} type="large">
      {slugs.length > 0 ? (
        <Grid type="col-3">
          {slugs.map((slug) => (
            <CategoryProjectCard
              key={slug}
              category={category ?? ""}
              slug={slug}
              entry={entries[slug]}
            />
          ))}
        </Grid>
      ) : (
        <p>No projects added for this category</p>
      )}
    </Widget>
  );
}

function CategoryProjectCard({
  category,
  slug,
  entry,
}: {
  category: string;
  slug: string;
  entry: ProjectEntry;
}) {
  if (entry.kind === "document") {
    return (
      <DocumentProjectCard category={category} slug={slug} title={entry.title} />
    );
  }

  return <DemoProjectCard category={category} slug={slug} title={entry.title} />;
}

function DemoProjectCard({
  category,
  slug,
  title,
}: {
  category: string;
  slug: string;
  title: string;
}) {
  const { image, description, tags } = useProjectData(category, slug);

  return (
    <Card
      title={title}
      footer={tags}
      icon={image ? undefined : "image"}
      image={image?.src}
      type="item"
      href={`/projects/${category}/${slug}`}
    >
      {description}
    </Card>
  );
}

function DocumentProjectCard({
  category,
  slug,
  title,
}: {
  category: string;
  slug: string;
  title: string;
}) {
  const { data } = useProjectDocument(category, slug);

  return (
    <Card
      title={title}
      footer={data?.tags}
      icon="image"
      type="item"
      href={`/projects/${category}/${slug}`}
    >
      {data?.description}
    </Card>
  );
}

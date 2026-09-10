import { Suspense } from "react";
import { useParams } from "react-router-dom";
import Widget from "../../components/Widget/Widget";
import { capitalize } from "../../utils/text";
import { ProjectRegistry } from "./ProjectRegistry";

export function ProjectDetailPage() {
  const { category, slug } = useParams();
  const entry =
    category && slug ? ProjectRegistry[category]?.[slug] : undefined;

  return (
    <Widget title={entry?.title ?? capitalize(slug ?? "")} type="large">
      {entry ? (
        <Suspense fallback={<p>Loading...</p>}>
          <entry.component />
        </Suspense>
      ) : (
        <p>Could not load project</p>
      )}
    </Widget>
  );
}

import { useProjectDocument } from "../../../../../hooks/useProjectDocument";
import Button from "../../../../../components/Button/Button";
import Grid from "../../../../../components/Grid/Grid";
import { linkify } from "../../../../../utils/linkify";
import styles from "./SpecLens.module.css";

export default function SpecLens() {
  const { data, loading } = useProjectDocument("other", "speclens");

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Could not load project</p>;

  return (
    <>
      <Grid type="col-2">
        <div className={styles.content}>
          {data.description && <h4>{linkify(data.description)}</h4>}
          {data.subtitle && (
            <div className={styles.subtitle}>{linkify(data.subtitle)}</div>
          )}
          {data.paragraph?.map((paragraph, i) => (
            <div className={styles.paragraph} key={i}>
              {linkify(paragraph)}
            </div>
          ))}
          {data.sourceUrl && (
            <Button
              icon="download"
              label="Download thesis (PDF)"
              variant="primary"
              href={data.sourceUrl}
            />
          )}
        </div>
        <div className={styles.image}>
          {data.image && <img src={data.image.src} alt={data.image.alt} />}
        </div>
      </Grid>
    </>
  );
}

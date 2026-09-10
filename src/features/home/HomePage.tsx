import Widget from "../../components/Widget/Widget";
import Gallery from "../../components/Gallery/Gallery";
import Row from "../../components/Row/Row";
import Card from "../../components/Card/Card";

export function HomePage() {
  return (
    <div className="container">
      <Row>
        <Widget type="profile">
          <Card
            type="image"
            title="Kristine Klungland"
            image="https://firebasestorage.googleapis.com/v0/b/klungland-dev.firebasestorage.app/o/profile_picture.jpg?alt=media&token=3f369497-5935-4166-b74b-a22b9dcd92a6"
            footer="The website itself is built from scratch in React - consider it a part of the portfolio."
          >
            <span>
              I am a computer engineering graduate from the University of Agder.
              Somewhere between finishing my degree and working as a frontend
              developer, I picked up a genuine soft spot for the kind of problem
              that ruins your evening and makes the next morning worth it. This
              site is the result of wanting to build something entirely on my
              own terms, and a place to showcase what I have made along the way.
            </span>
          </Card>
        </Widget>
      </Row>

      <Widget title="Projects">
        <Gallery collectionName="projects" />
      </Widget>
    </div>
  );
}

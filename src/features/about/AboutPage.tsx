import { Fragment, useState } from "react";
import Grid from "../../components/Grid/Grid";
import Widget from "../../components/Widget/Widget";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import ButtonGroup from "../../components/Button/ButtonGroup";
import { aboutSections, techStack } from "./aboutContent";
import Timeline from "../../components/Timeline/Timeline";
import { linkify } from "../../utils/linkify";

export function AboutPage() {
  const [activeTitle, setActiveTitle] = useState(aboutSections[0].title);
  const activeSection =
    aboutSections.find((section) => section.title === activeTitle) ??
    aboutSections[0];

  const experience = [
    {
      label: "UiA",
      title: "B.Sc. Computer Engineering",
      description: "Software development",
      footer: "2023-2026",
    },
    {
      label: "UiA",
      title: "Student roles",
      description: "FYSE mentor, student representative, and IT exam support",
      footer: "2024-2026",
    },
    {
      label: "Utel",
      title: "Frontend Developer",
      description:
        "Part-time, then seasonal. Maintaining, testing and creating new features for a Svelte/TypeScript web application for the telecom business",
      footer: "2026",
    },
    {
      label: "UiA",
      title: "SpecLens - Bachelor Thesis",
      description:
        "AI-assisted, spec-driven frontend QA tool, built in collaboration with Utel & Newbringer using Claude and Codex",
      footer: "2026",
    },
    {
      label: "Utel",
      title: "Internship",
      description:
        "Internship as a chosen subject at UiA, worked 300 hours at Utel primarily on frontend tasks",
      footer: "2025",
    },
  ];

  return (
    <Widget title="About Me" type="large">
      <Grid type="timeline-col">
        <Card type="profile">
          <Card title="Tech Stack" type="info">
            {techStack.join(" · ")}
          </Card>
          <Timeline items={experience} type="vertical" />
        </Card>
        <Card>
          <ButtonGroup type="navigation">
            {aboutSections.map((section) => (
              <Fragment key={section.title}>
                <Button
                  label={section.title}
                  active={section.title === activeTitle}
                  onClick={() => setActiveTitle(section.title)}
                  type="nav"
                />
              </Fragment>
            ))}
          </ButtonGroup>
          {activeSection.paragraphs.map((paragraph, i) => (
            <span key={i}>{linkify(paragraph)}</span>
          ))}
        </Card>
      </Grid>
      <Grid type="col-3">
        <Card type="gallery" collectionName="experience" maxImages={3}></Card>
      </Grid>
    </Widget>
  );
}

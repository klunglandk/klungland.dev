// Definerer rutene/URL-ene
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../features/home/HomePage";
import { AboutPage } from "../features/about/AboutPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { ProjectCategoryPage } from "../features/projects/ProjectCategoryPage";
import { ProjectDetailPage } from "../features/projects/ProjectDetailPage";
import { ContactPage } from "../features/contact/ContactPage";
import { ROUTES } from "../config/routes";

export default function Router() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path={ROUTES.projects} element={<ProjectsPage />} />
      <Route path={ROUTES.projectCategory} element={<ProjectCategoryPage />} />
      <Route path={ROUTES.projectDetail} element={<ProjectDetailPage />} />
      <Route path={ROUTES.contact} element={<ContactPage />} />
    </Routes>
  );
}

import type { Route } from "./+types/home";
import EducationalToysHub from "~/components/educational-toys-hub";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <EducationalToysHub />;
}

import type { Route } from "./+types/home";
import { AuthLayout } from "./auth/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home page" },
    { name: "Home Page", content: "Welcome to Home page!" },
  ];
}

export default function Home() {
  return <AuthLayout />;
}

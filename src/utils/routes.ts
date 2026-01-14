import { Home } from "@/pages/Home/Home";

export interface RouteType {
  path: string;
  name: string;
  component: React.ComponentType;
  showNavbar: boolean;
}

export const ROUTES: RouteType[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
    showNavbar: true,
  },
];

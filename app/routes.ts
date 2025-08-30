import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./routes/main.tsx"),
//   route("about", "./routes/about.tsx"),

  layout("./routes/auth/layout.tsx", [
    route("login", "./routes/auth/login.tsx"),
    route("register", "./routes/auth/register.tsx"),
  ]),

  layout("./routes/home/layout.tsx", [
    route("home", "./routes/home/home.tsx"),
  ]),

] satisfies RouteConfig;

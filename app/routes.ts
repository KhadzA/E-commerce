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

  layout("./routes/authGuard.tsx", [
    layout("./routes/admin/home/layout.tsx", [
      route("home", "./routes/admin/home/home.tsx"),
    ]),
    layout("./routes/admin/products/layout.tsx", [
      route("products", "./routes/admin/products/product.tsx"),
    ]),
    layout("./routes/admin/orders/layout.tsx", [
      route("orders", "./routes/admin/orders/orders.tsx"),
    ]),
    layout("./routes/admin/cart/layout.tsx", [
      route("cart", "./routes/admin/cart/cart.tsx"),
    ]),
    layout("./routes/admin/profile/layout.tsx", [
      route("profile", "./routes/admin/profile/profile.tsx"),
    ]),
  ]),

] satisfies RouteConfig;

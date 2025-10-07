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
    // ADMIN
    layout("./routes/admin/home/layout.tsx", [
      route("admin/home", "./routes/admin/home/home.tsx"),
    ]),
    layout("./routes/admin/products/layout.tsx", [
      route("admin/products", "./routes/admin/products/product.tsx"),
    ]),
    layout("./routes/admin/orders/layout.tsx", [
      route("admin/orders", "./routes/admin/orders/orders.tsx"),
    ]),
    layout("./routes/admin/cart/layout.tsx", [
      route("admin/cart", "./routes/admin/cart/cart.tsx"),
    ]),
    layout("./routes/admin/profile/layout.tsx", [
      route("admin/profile", "./routes/admin/profile/profile.tsx"),
    ]),

    // CUSTOMER/USER
    layout("./routes/customer/home/layout.tsx", [
      route("customer/home", "./routes/customer/home/home.tsx"),
    ]),
    layout("./routes/customer/products/layout.tsx", [
      route("customer/products", "./routes/customer/products/product.tsx"),
    ]),
    layout("./routes/customer/orders/layout.tsx", [
      route("customer/orders", "./routes/customer/orders/orders.tsx"),
    ]),
    layout("./routes/customer/cart/layout.tsx", [
      route("customer/cart", "./routes/customer/cart/cart.tsx"),
    ]),
    layout("./routes/customer/profile/layout.tsx", [
      route("customer/profile", "./routes/customer/profile/profile.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

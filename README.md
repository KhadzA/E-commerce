# Simple E-Commerce Frontend (WIP)

This is just the **frontend** of a simple e-commerce project I started out of boredom.
There’s no real backend yet, and most of the data handling is done using **local storage** as a temporary solution.
Eventually, I plan to build a proper backend for this, but for now it’s mainly a UI prototype.

---

## Project Structure and Pages

The app uses a layout and routing structure similar to React Router.
Here’s the current routing setup:

```ts
(index("./routes/main.tsx"),
  // route("about", "./routes/about.tsx"),

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
  ]));
```

### Pages Overview

- **Main (/**)\*\* – Landing page
- **Auth** – Login and Register pages (dummy only, no real backend)
- **Admin**
  - Home
  - Products
  - Orders
  - Cart
  - Profile (empty for now)

- **Customer/User**
  - Home
  - Products
  - Orders
  - Cart
  - Profile (empty for now)

---

## How Data Works

Right now, everything is stored in **local storage**. There’s no actual database or API involved.
This includes products, cart items, and orders.

There’s also no real authentication. You can just navigate directly to:

- `http://localhost:5173/admin/home`
- `http://localhost:5173/customer/home`

to access the dashboards.

If you want to use the login page, there are two dummy accounts:

| Role  | Email                                     |
| ----- | ----------------------------------------- |
| Admin | [admin@gmail.com](mailto:admin@gmail.com) |
| User  | [user@gmail.com](mailto:user@gmail.com)   |

There are no passwords, this is just for simulating the flow.

---

## Features

- Basic product management for admin (add, edit, delete, search)
- Cart and quick buy functionality for both admin and customers
- Simple search system for products
- Basic recommended product section (randomized)
- Some logic has been separated into handler files to keep things more organized (e.g. `adminProductHandlers.ts`, `adminHomeHandlers.ts`)

---

## Design Notes

The design is very simple and mostly recycled. I’m not great at frontend design, so this is mostly functional rather than pretty.
Styling is minimal and straightforward.

---

## Future Plans

- Proper authentication and backend integration
- Real route protection
- Profile pages (they’re currently empty, waiting for real authentication)
- Backend development (still deciding what stack to use)
- Improved UI and user experience

---

## Final Notes

This is just a frontend project meant for experimenting and practicing.
You can run it locally and explore it easily without setting up any backend.

I didn’t include screenshots because the project is simple enough to explore by running it yourself, apologies and thank you.

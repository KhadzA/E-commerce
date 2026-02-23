# Simple E-Commerce App

A simple full-stack e-commerce project I built as a beginner to practice both frontend and backend development. Nothing fancy — no real database, no fancy frameworks. Just me trying to figure things out.

---

## What This Is

This is a basic e-commerce app with an **admin** side and a **customer** side. It has a real frontend and a real backend talking to each other, but instead of a database, all data is stored in plain `.txt` files on the server. I know that's not how real apps work, but it was a good way to learn how data flows between a frontend and a backend without having to deal with setting up a database.

---

## Tech Stack

**Frontend**

- React + TypeScript
- React Router v7
- Tailwind CSS
- Recharts (for the admin dashboard charts)

**Backend**

- Node.js + Express
- Plain `.txt` files as makeshift storage (`usersTemp.txt`, `productsTemp.txt`, `ordersTemp.txt`, `cartTemp.txt`, `profileTemp.txt`)

---

## Features

### Admin

- Dashboard with sales stats, charts, top products, top categories, top users, and best sales day
- Product management — add, edit, delete, search, bulk delete
- Order history — all orders across all users
- Cart and quick buy
- Profile page

### Customer

- Personalized home page with product recommendations, cart summary, and recent orders
- Product browsing with add to cart and buy now
- Order history — only their own orders
- Cart management
- Profile page with editable name, phone, and address

### Auth

- Register with name, email, and password
- Login with role-based routing — admins go to the admin dashboard, customers go to the customer home
- Roles are stored in the profile file; new registrations are always `customer` by default

---

## Project Structure

```
├── app/
│   ├── routes/
│   │   ├── auth/           # Login, Register
│   │   ├── admin/          # Admin pages (home, products, orders, cart, profile)
│   │   └── customer/       # Customer pages (home, products, orders, cart, profile)
│   └── handlers/
│       ├── auth/           # Auth logic
│       ├── admin/          # Admin handlers (products, cart, orders, home)
│       └── customer/       # Customer handlers
│
└── server/
    ├── controllers/        # Business logic per feature
    ├── routes/             # Express route definitions
    ├── middleware/
    └── *.txt               # Flat file "database"
```

---

## Running Locally

**Backend**

```bash
cd server
npm install
node server.js
```

Runs on `http://localhost:5000`

**Frontend**

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## Notes

- This is a learning project. The `.txt` file storage is intentional as a stepping stone — I wanted to understand how a backend works before jumping into SQL or MongoDB.
- There's no password hashing. Passwords are stored as plain text. Please don't use real passwords if you're testing this.
- Role management is manual — to make someone an admin, edit their line in `profileTemp.txt` and change `role:customer` to `role:admin`.
- I'm still a beginner so the code isn't perfect, but I tried to keep things organized by separating logic into handler files.

---

## What I Learned

- How a frontend and backend communicate through a REST API
- How to structure routes, controllers, and handlers
- How state flows through a React app
- How role-based routing works
- That flat files are not a database, but they taught me why databases exist

---

_Built from scratch as a personal learning project. Thanks for checking it out._

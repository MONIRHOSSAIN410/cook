# CookMe — Healthy. Fresh. Ready.

A full-stack e-commerce shop: **React + Redux Toolkit + Tailwind CSS** on the front,
**Node.js + Express + MongoDB** on the back.

```
cook/
├── backend/          Node.js + Express API ("type": "module")
│   ├── config/       MongoDB connection
│   ├── models/       Mongoose schemas — Product, Category, User, Order
│   ├── controllers/  Request handlers
│   ├── routes/       Express routers
│   ├── middleware/   Auth + error handling
│   ├── seed/         Sample catalogue seeder
│   └── server.js
└── frontend/         React 18 + Vite
    ├── public/       CookMe logo and favicon
    └── src/
        ├── api/          Axios client (+ offline catalogue fallback)
        ├── data/         Shop settings and the product/image catalogue
        ├── redux/        Store and slices
        ├── components/   Navbar, Footer, HeroCarousel, InfiniteMarquee, ProductCard …
        └── pages/        Home, Shop, Category, Product, Cart, Checkout, Receipt …
```

## Running it

Two terminals.

**1. Backend**

```bash
cd backend
npm install
npm run seed     # fills MongoDB with categories, products and an admin user
npm run dev      # http://localhost:5000
```

MongoDB must be running locally (`mongodb://127.0.0.1:27017/cookme`). Point
`MONGO_URI` in `backend/.env` somewhere else — MongoDB Atlas, for example — if you
prefer.

**2. Frontend**

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Vite proxies `/api` to the backend, so there is no CORS setup to do in development.

Seeded admin login: `admin@cookme.com` / `password123`.

## What is built in

- **Responsive** — one column on phones, two to three on tablets, up to five on desktop.
- **Dark mode** — class-based Tailwind dark mode, remembered in `localStorage` and
  applied before first paint, so there is no white flash on load.
- **Product cards** — every card has an image, zooms and scales on hover, and animates
  in with Framer Motion. A failed image falls back to a labelled placeholder, so a card
  is never an empty box.
- **Hero + nonstop carousel** — an auto-playing hero slider with a seamless,
  never-ending product marquee directly below it.
- **Order receipt** — checkout creates an order and lands on a printable receipt at
  `/order/CM-YYMMDD-XXXX`. The same number works on the `/track` page.
- **Offline catalogue** — if the API is down or MongoDB has not been seeded, the shop
  still shows its full catalogue with pictures instead of empty pages.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/products` | List with search, filters, sorting |
| GET | `/api/products/:idOrSlug` | One product + related items |
| POST | `/api/products/:id/reviews` | Add a review (signed in) |
| GET | `/api/categories` | Categories with product counts |
| POST | `/api/orders` | Place an order, returns the receipt |
| GET | `/api/orders/:orderNumber` | Receipt lookup |
| GET | `/api/orders/mine/list` | The signed-in customer's orders |
| POST | `/api/users/register` · `/api/users/login` | Auth |

## Hotline

01711254089 · 01911970994

# नखRaah Nail Studio — Full Stack Website

Premium nail art studio website with Angular frontend and Node.js/Express/PostgreSQL backend.

## Tech Stack

### Frontend
- Angular 17 (standalone components, lazy loading)
- Angular Material
- SCSS with custom design system
- Scroll reveal animations
- Responsive design (desktop, tablet, mobile)
- Dark mode, SEO meta tags, Open Graph

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT authentication
- Multer image uploads
- MVC architecture

## Project Structure

```
Nakhraah/
├── frontend/          # Angular application
│   └── src/app/
│       ├── core/      # Layouts
│       ├── shared/    # (components live in components/)
│       ├── pages/     # Public & admin pages
│       ├── components/# Reusable UI components
│       ├── services/  # API services
│       ├── models/    # TypeScript interfaces
│       ├── guards/    # Route guards
│       ├── interceptors/
│       ├── pipes/
│       └── directives/
├── backend/           # Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       └── db/
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

## Installation

### 1. Clone & setup backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 2. Create database

```sql
CREATE DATABASE nakhraah;
```

### 3. Run migrations & seed

```bash
npm run db:setup
npm run db:seed
```

Default admin credentials (change in production):
- **Email:** admin@nakhraah.com
- **Password:** Admin@123

### 4. Start backend

```bash
npm run dev
# API runs at http://localhost:3000
```

### 5. Setup frontend

```bash
cd ../frontend
npm install
npm start
# App runs at http://localhost:4200
```

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Gallery | `/gallery` |
| Contact | `/contact` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/services` | No | List services |
| POST | `/api/services` | Admin | Create service |
| PUT | `/api/services/:id` | Admin | Update service |
| DELETE | `/api/services/:id` | Admin | Delete service |
| GET | `/api/gallery` | No | List gallery |
| GET | `/api/gallery/categories` | No | Categories |
| POST | `/api/gallery` | Admin | Upload image |
| DELETE | `/api/gallery/:id` | Admin | Delete image |
| GET | `/api/testimonials` | No | List testimonials |
| POST | `/api/testimonials` | Admin | Create testimonial |
| POST | `/api/appointments` | No | Book appointment |
| GET | `/api/appointments` | Admin | List appointments |
| GET | `/api/dashboard/stats` | Admin | Dashboard stats |

## Design System

| Token | Value |
|-------|-------|
| Primary | `#E2F9D1` |
| Secondary | `#FAD4DE` |
| Accent | `#F08A9B` |
| Background | `#F9FFF5` |
| Text | `#333333` |

**Fonts:** Poppins (body), Playfair Display (headings)

## Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Environment Variables

See `backend/.env.example` for all backend variables.
Update `frontend/src/environments/environment.prod.ts` for production API URL.

## License

Private — नखRaah Nail Studio © 2026

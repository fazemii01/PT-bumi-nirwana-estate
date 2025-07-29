# Project PT Bumi Nirwana Estate

## 1. Introduction

### Project Overview
This project is a comprehensive property catalog system for PT Bumi Nirwana Estate. It consists of a web application and a mobile application, both powered by a single back-end. The system provides a complete catalog of housing products, including images, floor plans, prices, and location maps.

### Project Goals
The main goal of this project is to deliver a unified back-end that powers:
- An existing React web app, extended with a full catalog and chatbot.
- A brand-new mobile app that lets users browse every housing project with photos, floor plans, pricing, and an interactive map.

### Target Audience
The target audience for this project includes:
- Potential buyers looking for detailed information about properties.
- Real estate agents who need a comprehensive tool to showcase properties to clients.
- Company management who want to monitor sales and marketing activities.

## 2. Project Design

### System Overview
```mermaid
graph TD
    A[Users] --> B{Web App (React)};
    A --> C{Mobile App (Flutter)};
    B --> D[Back-End (NestJS)];
    C --> D;
    D --> E[Database (PostgreSQL)];
    D --> F[Object Storage (MinIO/S3)];
    D --> G[Cache (Redis)];
    D --> H[Search (Elasticsearch)];
    B --> I[Chatbot];
```

### Data Model (simplified)
```
Property {
  id: uuid PK
  name: string
  slug: string (SEO)
  devPhase: enum (PreLaunch, ReadyStock, SoldOut)
  images: string[] // presigned URLs
  floorPlans: { name: string, url: string }[]
  price: numeric(15,2)
  priceUnit: enum (IDR, /month, /m²)
  location: geography(Point,4326)
  address: jsonb { street, city, province }
  specs: jsonb { lt, lb, bedrooms, bathrooms }
  createdAt, updatedAt
}
```

### API Contract (REST / GraphQL)
```
GET /v1/properties?page=&lat=&lng=&radius=
GET /v1/properties/:id
POST /v1/favorites (auth)
WS /chatbot → { type: 'message', threadId, text }

GraphQL (if preferred)
query Properties($filter: PropertyFilter) { ... }
subscription PriceUpdated($propertyId: ID!) { ... }
```

## 3. Tech Stack and Technology

### Back-End
- **Framework:** NestJS (TypeScript)
- **DB:** PostgreSQL 15 (PostGIS for geo-queries)
- **Object storage:** MinIO (on-prem) or AWS S3 (cloud)
- **Cache & pub/sub:** Redis
- **Search:** Elasticsearch
- **Auth:** JWT (access) + refresh tokens
- **Realtime:** Socket.io gateway
- **Docs:** Swagger/OpenAPI + GraphQL codegen

### Front-End Web
- **Framework:** Next.js 14 (App Router, React 18)
- **Styling:** TailwindCSS + HeadlessUI
- **State:** Zustand (lightweight) + React-Query (server state)
- **Maps:** Mapbox GL JS
- **Chatbot:** React-Chatbotify or custom UI wired to WebSocket
- **Image viewer:** yet-another-react-lightbox + next/image

### Front-End Mobile
- **Framework:** Flutter 3.22 (Dart 3)
- **Architecture:** Clean Architecture + Riverpod (Generator)
- **DI:** get_it + injectable
- **Routing:** Auto_route (deep-links)
- **Networking:** Retrofit/Dio (REST) + Hive cache
- **JSON:** freezed + json_annotation
- **Maps:** google_maps_flutter + flutter_map fallback
- **Image / PDF viewer:** extended_image + flutter_pdfview + photo_view
- **Local storage:** Hive (favorites), flutter_secure_storage (tokens)
- **Push:** Firebase Cloud Messaging
- **CI/CD:** GitHub Actions → EAS-like via Flutter workflow
- **OTA hot-fix:** Shorebird

### DevOps & Tooling
- **Infra as Code:** Terraform (AWS) or Ansible (on-prem)
- **CI/CD:** GitHub Actions → EAS (mobile) & Vercel (web)
- **Tests:** Jest + React-Testing-Library, Detox (E2E mobile), Playwright (web)
- **Code quality:** ESLint, Prettier, Husky pre-commit
- **Monitoring:** Sentry (FE + BE), Prometheus + Grafana (infra)

## 4. 8-Week Sprint Plan (MVP)

- **Week 0 – Discovery:** Confirm scope, branding, non-functional (offline first? 3D tour?).
- **Week 1 – Back-End Skeleton:** NestJS project, auth module, DB schema, migrations. Seed 5 sample properties.
- **Week 2 – Image & File Service:** MinIO bucket, signed-upload endpoints, image resize Lambda/Sharp. CDN (CloudFront / Cloudflare).
- **Week 3 – Web Catalog Module:** Property list page (filters, pagination). Detail page with image gallery, map embed, price display. SEO: next-sitemap, dynamic meta tags.
- **Week 4 – Mobile Skeleton & Catalog:** Expo init, tab navigation (Home, Catalog, Favorites, Profile). Catalog screen = shared components with web (React-Native-Web compatible).
- **Week 5 – Maps & Geo Search:** PostGIS radius queries. Web: Mapbox clusters. Mobile: react-native-maps with custom callouts.
- **Week 6 – Chatbot Integration:** WebSocket gateway in NestJS. RAG-style bot (context = property FAQ + current listings). UI: floating chat bubble on web, tab screen on mobile.
- **Week 7 – Polish & QA:** Offline favorites caching on mobile. E2E tests (Playwright + Detox). Performance: image lazy-loading, code-splitting.
- **Week 8 – Release:** Web → production (Vercel). Mobile: internal TestFlight / Play Console Closed Testing. Collect feedback, plan v1.1 (360° tour, mortgage calculator).

## 5. Risk Register

- **Image storage cost:** compress on upload, serve WebP.
- **Location accuracy:** use Google Place ID fallback.
- **Chatbot hallucination:** add “human hand-off” after 3 failed answers.
- **Mobile store policy:** no WebView-only app; ensure native navigation.

## 6. Hand-off Checklist

- [ ] OpenAPI & GraphQL schema merged to main
- [ ] .env.example & README for each repo
- [ ] GitHub Actions badges green
- [ ] Sentry DSN configured for staging & prod
- [ ] App store assets (screenshots, privacy policy) ready
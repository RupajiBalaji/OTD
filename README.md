# OTD (Outfit Of The Day) — AI Personal Stylist & Smart Wardrobe Assistant

> **OTD: Outfit Of The Day.** Precision chromatic algorithms, predictive wardrobe graphs, and bespoke daily outfit curation.


---

## 🏛️ Monorepo Architecture

The project is organized into three segregated, modular directories:

```
OTD/
├── app/                  # Flutter Android Mobile Application
│   ├── lib/              # 5 core mobile screens (OTD Daily, Closet, Studio, Gap, Feed)
│   ├── android/          # Native Android configuration
│   └── release/          # Compiled APK distribution binaries
│
├── backend/              # Node.js Express TypeScript API
│   ├── src/              # Auth, Wardrobe, Outfits, & Intelligence modules
│   ├── scripts/          # Database seeding & automation scripts
│   └── tests/            # Test suite
│
├── web/                  # Luxury Web Frontend (Vite 6 + React 19 + TypeScript + Tailwind)
│   ├── src/              # Interactive Atelier, Closet Matrix, Gap Simulator, Lookbook
│   ├── public/           # Official OTD logo artwork & standalone APK asset
│   └── index.html        # Dual Ivory Light (#F7EFE0) & Obsidian Dark theme engine
│
└── .gitignore            # Clean root build & binary exclusions
```

---

## 💎 Modules Overview

### 1. `web/` — Haute Luxury Web Experience
- **Tech Stack**: Vite 6, React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Dual Couture Themes**:
  - **Ivory Silk Mode (Light - Default)**: Pixel-matched to the official `#F7EFE0` OTD logo canvas with deep espresso noir typography (`#1C1612`).
  - **Obsidian Dark Mode**: Deep `#09090C` canvas with champagne gold accents (`#D4AF37`).
- **Interactive Modules**:
  - **Live Atelier Simulator**: Test real-time outfit curation with customizable occasions and aesthetics.
  - **Digital Closet Matrix**: Interactive garment telemetry, fabric physics, and cost-per-wear tracking.
  - **Closet Gap Intelligence Engine**: Graph network calculating wardrobe expansion multipliers.
  - **Direct Android APK Sideload Modal & QR Sharing**.

#### Running the Web App:
```bash
cd web
npm install
npm run dev
```

---

### 2. `backend/` — Styling & Intelligence API
- **Tech Stack**: Node.js, Express, TypeScript, JWT Authentication, Prisma/Mongoose data models.
- **Microservices**:
  - `auth`: User authentication, JWT refresh token rotation, password hashing.
  - `wardrobe`: Clothing digitization, classification, chromatic tagging.
  - `outfits`: Daily OTD algorithmic curation, climate and schedule synchronization.
  - `intelligence`: Closet gap identification and graph-connectivity analysis.

#### Running the Backend:
```bash
cd backend
npm install
npm run dev
```

---

### 3. `app/` — Flutter Android Mobile Companion
- **Tech Stack**: Flutter 3.x, Dart, Material 3 with luxury theme extensions.
- **Key Screens**:
  - `Daily OTD Atelier`: Today's curated look with weather and calendar integration.
  - `Smart Wardrobe`: High-resolution catalog of physical clothes.
  - `Virtual Fitting Studio`: Photorealistic outfit layering and silhouette balancing.
  - `Closet Intelligence`: Gap detection and cost-per-wear telemetry.
  - `Private Feed`: Curated editorial styling community.

#### Building the APK:
```bash
cd app
flutter pub get
flutter build apk --debug
```

---

## 📜 Official Brand Identity
- **Logo**: Hand-drawn evening gown and tailored jacket beneath the iconic **OTD** hanging rail.
- **Canvas Colors**:
  - Light: `#F7EFE0` (Ivory Linen Silk)
  - Dark: `#09090C` (Obsidian Noir)
  - Accent: `#D4AF37` / `#A67C1E` (Champagne Gold)

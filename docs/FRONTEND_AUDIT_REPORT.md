# OTD Web Frontend Feature-Completeness & Architectural Audit

**Project:** OTD (Outfit of the Day)  
**Date:** October 19, 2026  
**Auditor:** Senior Frontend Engineer  
**Scope:** `web/` directory (React 19, TypeScript 5.9, Vite 8, Tailwind CSS 4)  
**Reference Documents:**  
- [OTD FRONTEND HANDOFF.docx](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)  
- [PRODUCT_SPEC_MVP.md](file:///c:/Users/pc/Desktop/OTD/docs/PRODUCT_SPEC_MVP.md)  
**Evaluation Standard:** Production Feature Completeness, Handoff Compliance, Code Quality & Clean Architecture Standards  

---

## A. Executive Summary

### 1. Overall State of the Web Frontend
The web codebase currently exists in a state of **architectural duality**:
1. **Landing & Marketing Layer:** A presentation website ([Hero.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx), [Pillars.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/Pillars.tsx), [Lookbook.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/Lookbook.tsx), [AppDownload.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppDownload.tsx)) designed to showcase brand aesthetic and promote the Android APK.
2. **App Studio Workspace:** A monolithic interactive prototype ([AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx)) embedded via view-state switching (`viewMode === 'studio'`).

The UI successfully captures the luxury editorial brand direction (warm beige/cream `#F7EFE0`, obsidian dark `#09090C`, gold accents, serif typography, and rich visual cards). The TypeScript build compiles with **0 errors**, and linting passes with only 2 Fast Refresh warnings on context exports.

However, from a production product standpoint, **the web frontend is an isolated client-side mock sandbox**. There is **zero API integration** across the entire application—no HTTP client (`fetch`/`axios`), no service layer, no environment variables (`.env`), no token management, and no connection to the existing Express backend (`/api/v1/auth`, `/api/v1/wardrobe`, `/api/v1/outfits`). Furthermore, critical screens and views (Login/Sign-up, Saved Looks, History, Settings, Notifications) are either entirely missing or render blank pages.

---

### 2. Most Important Completed Areas
- **Design System & Theme Engine:** Robust Light (`#F7EFE0`) / Dark (`#09090C`) theme engine in [ThemeContext.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/context/ThemeContext.tsx) and [index.css](file:///c:/Users/pc/Desktop/OTD/web/src/index.css) utilizing CSS variables and HTML `data-theme` attributes.
- **Onboarding Survey Wizard:** Multi-step wizard in [OnboardingModal.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/OnboardingModal.tsx) capturing biometrics, style preferences, colors, fit, and goals, writing to local context.
- **Interactive "Create My Look" Wizard UI:** 3-step wizard in [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) and [Hero.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx) covering occasion, destination category, mood chips, auto-detected weather mock, and outfit recommendation preview.
- **Client-Side Conversational Stylist Simulation:** Substring-matching chat in [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) and [ClosetContext.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/context/ClosetContext.tsx) that handles prompt chips like `"Make it more casual"` and `"Change the shoes"`.
- **Garment Upload Modal Prototype:** Camera/scan simulator in [AddPieceModal.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AddPieceModal.tsx) with attribute confirmation form (Category, Color, Fit, Formality 1–5).

---

### 3. Biggest Remaining Gaps
1. **Zero Backend API & Authentication (P0 Blocker):**
   - The handoff explicitly mandates Login/Sign Up ([Section 4.B](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)). The frontend has **no login or registration screen**; the "Sign In" button in [Navbar.tsx:142](file:///c:/Users/pc/Desktop/OTD/web/src/components/Navbar.tsx#L142) simply opens the onboarding survey.
   - No JWT/session token handling, no protected routes, no connection to backend `/api/v1/auth/login` or `/api/v1/auth/register`.
2. **Hardcoded Data & Anti-Patterns (Violating Handoff Section 9):**
   - In [AppStudio.tsx:56-65](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L56-L65), the destination is permanently hardcoded to `"L'amore, Banjara Hills, Hyderabad"`, weather to `"28°C Partly Cloudy"`, and the user name to `"Mustafa Ali"`.
   - In [AppStudio.tsx:1463-1468](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1463-L1468), recommendation pieces are hardcoded static strings (`"Zara Man"`, `"Massimo Dutti"`) rather than dynamically referencing closet items by ID.
3. **Dead Navigation & Blank Screens:**
   - In [AppStudio.tsx:276-285](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L276-L285), clicking sidebar tabs for **`Outfit Ideas`**, **`Destinations`**, **`Calendar`**, or **`Saved Looks`** causes the main viewport to render completely blank because no JSX conditional branches exist for these tab IDs.
   - Settings, Help, and Notifications are wired to browser `alert()` statements ([AppStudio.tsx:332, 339, 399](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L332-L404)).
4. **Desktop-Only Studio (Missing Mobile-First Navigation):**
   - [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) relies on a desktop sidebar (`hidden md:flex`). On mobile screens (<768px), the sidebar vanishes and **no bottom navigation bar exists**, trapping mobile users on whatever tab was initialized.
5. **Architectural & Component Deficits:**
   - None of the required atomic components ([Section 10](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)) exist: no reusable `Button`, `IconButton`, `Input`, `Select`, `Card`, `Toast`, `Skeleton`, `ItemCard`, or `ContextChip`.
   - [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) is a 1,717-line god component mixing navigation, forms, chat, closet grids, and hardcoded datasets.

---

### 4. Features Blocked by Dependencies
- **Computer Vision Clothing Recognition:** Smart upload depends on an image classification endpoint or multimodal vision model. Currently simulated via `setTimeout` in [AddPieceModal.tsx:38](file:///c:/Users/pc/Desktop/OTD/web/src/components/AddPieceModal.tsx#L38).
- **AI Recommendation Engine & Chat:** Stylist conversation and context ranking depend on backend LLM orchestration (`/api/v1/outfits/generate`, `/api/v1/ai`). Currently simulated via client-side string regex.
- **Dynamic Weather & Geocoding:** Auto-fetch weather and venue discovery depend on backend integration with OpenWeather/Tomorrow.io and Google Places.
- **Virtual Try-On / Avatar (P2):** Photorealistic cloth simulation pipeline is deferred/placeholder as permitted by MVP specification.

---

## B. Feature-by-Feature Audit Table

| Priority | Feature / Screen | Handoff Requirement | Status | Evidence (Files & Symbols) | What's Missing / Needs Testing | Recommended Next Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Foundation** | **Design System & Theming** | Neutral palette, `#F7EFE0` cream, gold accent, serif headings, dark mode, mobile-first tokens | **Implemented and verified** | [index.css:4-70](file:///c:/Users/pc/Desktop/OTD/web/src/index.css#L4-L70), [ThemeContext.tsx:13-50](file:///c:/Users/pc/Desktop/OTD/web/src/context/ThemeContext.tsx#L13-L50) | Missing unified button/input primitives and touch-target audit on small viewports. | Extract CSS tokens into reusable component primitives in `src/components/ui/`. |
| **Foundation** | **Mobile-First Persistent Nav** | Bottom navigation on mobile with Home, Closet, Try-On, Feed, Profile | **Partially implemented** | [Navbar.tsx:26-185](file:///c:/Users/pc/Desktop/OTD/web/src/components/Navbar.tsx#L26-L185), [AppStudio.tsx:252-346](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L252-L346) | In Studio mode, the left sidebar is hidden on mobile (`hidden md:flex`). No mobile bottom navigation exists in Studio. | Build a persistent `BottomNav` component for mobile viewport in `AppStudio.tsx`. |
| **Foundation** | **API & Service Architecture** | Centralized API client, env vars, token handling, separation of UI and network calls | **Missing** | [package.json:12-18](file:///c:/Users/pc/Desktop/OTD/web/package.json#L12-L18) (no axios/query client), zero `.env` | No `fetch`/`axios` calls exist in `src/`. No API services or endpoint contracts created. | Create `src/lib/api-client.ts` and domain services (`auth.service.ts`, `wardrobe.service.ts`). |
| **P0** | **4.A Welcome / Splash** | App launch branding, subtle loading, session check, branch to login/home | **Missing** | [App.tsx:63-136](file:///c:/Users/pc/Desktop/OTD/web/src/App.tsx#L63-L136) | App directly renders landing page or studio; no auth/session check or splash loader. | Implement `SplashScreen` with token check against `GET /api/v1/auth/me`. |
| **P0** | **4.B Login / Sign Up** | Email/phone, password, show/hide, forgot password, error states, auth tokens | **Missing** | [Navbar.tsx:142-149](file:///c:/Users/pc/Desktop/OTD/web/src/components/Navbar.tsx#L142-L149) | "Sign In" button merely opens `OnboardingModal`. Zero auth forms, validation, or API calls exist. | Build dedicated `AuthModal` / `/login` page connecting to `POST /api/v1/auth/login` & `/register`. |
| **P0** | **4.C Personal Details Onboarding** | Name, age, gender, height, body/fit, skin tone, continue, back, validation | **Partially implemented** | [OnboardingModal.tsx:15-26, 243-505](file:///c:/Users/pc/Desktop/OTD/web/src/components/OnboardingModal.tsx#L15-L505) | UI exists and captures state; missing inline form validation, skip action, and backend persistence. | Add Zod/React Hook Form validation and persist draft to `POST /api/v1/profile`. |
| **P0** | **4.D Style Preferences** | Style categories, preferred/avoided colors, fit, formal/casual range, multi-select | **Partially implemented** | [OnboardingModal.tsx:507-698](file:///c:/Users/pc/Desktop/OTD/web/src/components/OnboardingModal.tsx#L507-L698) | Style and fit selection works locally; "avoided colors" is missing; search for options is missing. | Add "avoided colors" selector; map preferences to backend `UserPreference` schema. |
| **P0** | **4.E Goals & Interests** | Daily outfits, occasions, wardrobe utilization, save/continue | **Partially implemented** | [OnboardingModal.tsx:763-899](file:///c:/Users/pc/Desktop/OTD/web/src/components/OnboardingModal.tsx#L763-L899) | Selections save to `ClosetContext` / `localStorage` only; not passed to backend. | Connect completion handler to backend preference endpoints. |
| **P0** | **4.F Home / Dashboard** | Greeting, weather summary, Create My Look CTA, closet summary, recent look | **Partially implemented** | [AppStudio.tsx:426-848](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L426-L848) | UI present but entirely hardcoded to "Mustafa", static weather, and hardcoded "L'amore" plan. Empty state missing. | Replace hardcoded values with dynamic profile and wardrobe counts; add empty state. |
| **P0** | **4.G Destination & Occasion** | Search/input, venue categories, occasion, date/time, recent destinations | **Partially implemented** | [AppStudio.tsx:904-1180](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L904-L1180), [Hero.tsx:382-450](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L382-L450) | Search box only mutates local string. L'amore detail card is hardcoded. Geocoding API integration missing. | Integrate Google Places/backend `/api/v1/venues` search; handle non-physical venues. |
| **P0** | **4.H Mood & Weather Context** | Mood chips, weather auto-fetch, manual weather fallback, time of day | **Partially implemented** | [AppStudio.tsx:1182-1328](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1182-L1328), [Hero.tsx:436-449](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L436-L449) | Weather is hardcoded text ("28°C Partly Cloudy"). No browser geolocation or weather API call. | Implement Geolocation hook + OpenWeather integration with manual fallback. |
| **P0** | **4.I AI Generation / Thinking State** | Progressive status messages (wardrobe scan, context analysis, look generation), retry | **Missing** | [ClosetContext.tsx:128-170](file:///c:/Users/pc/Desktop/OTD/web/src/context/ClosetContext.tsx#L128-L170), [Hero.tsx:463-467](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L463-L467) | Instant 600ms `setTimeout` mock; no progressive status UI, cancellation, or timeout/retry handling. | Create `AiThinkingModal`/view showing progressive stages: scan -> analyze -> generate. |
| **P0** | **4.J AI Outfit Recommendation** | Outfit title, match %, piece cards mapped to closet IDs, Wear Look, Save, Share | **Partially implemented** | [AppStudio.tsx:1401-1511](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1401-L1511), [Hero.tsx:481-561](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L481-L561) | Look rendered, but pieces in Studio step 3 are hardcoded text (`Zara Man`), not real closet IDs. Share missing. | Map recommendation directly to `ClosetItem.id`; integrate `POST /api/v1/outfits/generate`. |
| **P0** | **4.K Why This Look?** | Ambience, weather comfort, palette harmony, wardrobe utilization | **Partially implemented** | [AppStudio.tsx:1487-1507](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1487-L1507), [Hero.tsx:547-561](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L547-L561) | Static text bullet points rendered; wardrobe utilization reasoning missing. | Bind rationale dynamically to the recommendation payload returned from API. |
| **P0** | **4.L AI Stylist / Modify** | Chat input, prompt chips ("Make it casual", "Change shoes"), updated look | **Partially implemented** | [AppStudio.tsx:1513-1608](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1513-L1608), [Hero.tsx:563-608](file:///c:/Users/pc/Desktop/OTD/web/src/components/Hero.tsx#L563-L608) | Client-side keyword interceptor in `setTimeout`. No connection to backend AI chat session. | Connect chat input to backend LLM conversation endpoint (`/api/v1/ai`). |
| **P0** | **4.M Digital Closet** | Category tabs, search, filter/sort, Add Piece, item details, edit, delete | **Partially implemented** | [WardrobeStudio.tsx:66-134](file:///c:/Users/pc/Desktop/OTD/web/src/components/WardrobeStudio.tsx#L66-L134), [AppStudio.tsx:1617-1670](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1617-L1670) | Categories work; **search is missing, filter/sort is missing, edit is missing, delete is missing**. | Implement search bar, sort dropdown, item edit/delete modals, and `DELETE /api/v1/wardrobe/:id`. |
| **P0** | **4.N Smart Item Upload** | Camera/gallery, AI attribute recognition, confirmation form, edit detection | **Partially implemented** | [AddPieceModal.tsx:91-282](file:///c:/Users/pc/Desktop/OTD/web/src/components/AddPieceModal.tsx#L91-L282) | Mock scanner only. No real `<input type="file">`, camera stream, crop, or computer vision API. | Wire up real file picker, image preview/crop, and multipart upload to `/api/v1/wardrobe`. |
| **P0** | **4.O Saved Looks / History** | Saved looks list, previous recommendations, date/context, reuse, delete | **Missing** | [AppStudio.tsx:284](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L284) (`activeTab === 'saved'` is unhandled) | Tab in sidebar exists, but clicking it renders a **blank screen**. In `Hero.tsx`, button is a local toggle only. | Build `SavedLooksView` rendering outfits saved in state / fetched from `/api/v1/outfits`. |
| **P1** | **4.P Profile / Style DNA** | Full profile calibration, body metrics, style personas, color preferences | **Partially implemented** | [UserProfileModal.tsx:70-178](file:///c:/Users/pc/Desktop/OTD/web/src/components/UserProfileModal.tsx#L70-L178) | Edits local state; missing avatar/photo upload, color palette editor, and backend sync. | Add avatar image upload and connect save button to `PATCH /api/v1/profile`. |
| **P1** | **4.S Notifications** | Result ready, upload complete, mark as read, permission handling | **Missing** | [AppStudio.tsx:399-404](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L399-L404) | Bell icon executes `alert('No new notifications...')`. No drawer, dropdown, or list. | Build notification popover/drawer with notification state and badge counts. |
| **P1** | **4.T Settings** | Account, privacy, permissions, data controls, logout, delete account | **Missing** | [AppStudio.tsx:331-337](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L331-L337) | Settings button triggers browser `alert()`. No settings screen or account deletion modal. | Implement `SettingsView` with account details, theme toggle, and logout flow. |
| **P2** | **4.Q Try-On / Fitting Room** | Select pieces, avatar drape preview, generation status, retry, save | **Partially implemented** | [AppStudio.tsx:1673-1709](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1673-L1709) | Static visual placeholder with alert on re-render. Complies with handoff allowing early placeholder. | Retain as structured placeholder; prepare API interface for avatar generation provider. |
| **P2** | **4.R Explore / Feed** | Style posts, open look, save/share, creator cards | **Partially implemented** | [Lookbook.tsx:52-105](file:///c:/Users/pc/Desktop/OTD/web/src/components/Lookbook.tsx#L52-L105), [AppStudio.tsx:280](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L280) | Landing page has 3 editorial cards; Studio tab `ideas` renders completely blank. | Render a curated feed grid in Studio or hide `ideas` tab until MVP release. |

---

## C. Detailed Deficiency & Gap Analysis

### 1. P0 Requirements Still Missing or Incomplete
1. **Authentication & Session Management ([Handoff 4.B](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - No Login or Registration screen/modal.
   - No email/password validation, credential error handling, or token storage (`accessToken` / `refreshToken`).
   - "Sign In" currently diverts directly to the onboarding questionnaire.
2. **Real File & Camera Input for Garment Upload ([Handoff 4.N](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - [AddPieceModal.tsx:94-107](file:///c:/Users/pc/Desktop/OTD/web/src/components/AddPieceModal.tsx#L94-L107) has no HTML `<input type="file">`. Clicking the drop area triggers a fake timer without letting users upload an image.
   - No cropping, client-side image compression, or multipart form data preparation.
3. **Digital Closet Management Actions ([Handoff 4.M](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - **No Search:** Users cannot search items by keyword, name, or color.
   - **No Sorting or Filtering:** Cannot filter by season, formality tier, or color.
   - **No Edit Item:** Cannot change attributes of an existing item.
   - **No Delete/Archive Item:** No destructive action or confirmation modal exists.
   - **No Empty State:** If `closet` array is empty, the grid is blank without guidance.
4. **Dynamic Recommendation IDs & Regeneration ([Handoff 4.J](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - Pieces displayed in [AppStudio.tsx:1463-1484](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx#L1463-L1484) are hardcoded text literals rather than mapping to `ClosetItem` objects.
   - No "Regenerate" button to request an alternate look using the same context.
   - No "Share" interaction.
5. **AI Generation / Thinking Progressive UI ([Handoff 4.I](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - The user is transitioned immediately with no feedback explaining context analysis, closet scanning, or outfit assembly.
   - No timeout fallback or retry button if the request stalls.

---

### 2. P1 and P2 Requirements Still Missing or Incomplete
1. **Saved Looks / History View ([Handoff 4.O](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - Clicking `Saved Looks` in the Studio sidebar sets `activeTab = 'saved'`, which produces a blank screen. There is no grid to review, open, reuse, or delete saved looks.
2. **Notifications UI ([Handoff 4.S](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - Bell icon triggers `alert()`; no notification drawer, unread indicator management, or navigation to related events.
3. **Settings Screen ([Handoff 4.T](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - Settings icon triggers `alert()`; no account management, unit toggles (metric/imperial), or data controls.
4. **Destination Intelligence Integration ([Handoff 4.G](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - Venue metadata is frozen on "L'amore" in Hyderabad. There is no mechanism to fetch actual venue ambience, dress codes, or opening hours for user-entered venues.
5. **Explore / Feed in Studio ([Handoff 4.R](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - `Outfit Ideas` tab in the Studio renders blank.

---

### 3. Reusable Architecture & Engineering Gaps
1. **Lack of Design System Primitives ([Handoff Section 10](file:///c:/Users/pc/Desktop/OTD/docs/OTD%20FRONTEND%20HANDOFF.docx)):**
   - No centralized UI component library (`Button`, `IconButton`, `Input`, `Select`, `Card`, `Modal`, `Toast`, `Skeleton`).
   - Every file writes verbose inline Tailwind classes (e.g. `px-5 py-2.5 rounded-full bg-black text-white...`).
   - Inconsistent button hover, pressed, disabled, and loading states across screens.
2. **Monolithic Component Structure:**
   - [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) is **1,717 lines long**, containing the dashboard, wizard steps 1–3, chat, digital closet grid, try-on preview, and top search bar.
   - Needs refactoring into modular feature sub-components: `StudioHome`, `PlannerWizard`, `ClosetGrid`, `ChatDrawer`.
3. **No Network / Service Layer:**
   - There is no API client (`fetch` wrapper with base URL, auth interceptor, and error handling).
   - Domain logic is scattered inside components or mock contexts.
4. **Mobile Navigation Defect:**
   - The Studio layout is hardcoded for desktop screens. Phone viewports lose all navigation capabilities.

---

### 4. Questions for Backend, AI/ML, and Product Owners

#### Questions for Backend Owner (Vasant):
1. **Auth & Tokens:** Will auth use `httpOnly` cookies for `refreshToken` and return `accessToken` in JSON, or should the frontend store both tokens in memory/storage?
2. **API Base URL & CORS:** What is the local development URL (e.g. `http://localhost:5000/api/v1`), and is CORS configured for `http://localhost:5173` with `credentials: true`?
3. **Garment Upload Contract:** Does `POST /api/v1/wardrobe` accept `multipart/form-data` with an image file, or does it require a pre-signed S3/GridFS upload URL first?
4. **Recommendation Payload:** What is the exact JSON schema returned by `POST /api/v1/outfits/generate`? Does it return populated item objects or an array of item IDs?

#### Questions for AI/ML Team:
1. **Recognition Pipeline Latency & Status:** Is garment recognition synchronous on upload, or is it asynchronous with polling / WebSocket updates (Pending -> Processing -> Ready)?
2. **Stylist Chat Context:** What conversational format does the LLM require for outfit modification (full message history vs. structured `{ outfitId, instruction }`)?
3. **Confidence Scores:** Does the AI return match percentages and rationale breakdown (ambience, weather, style) as structured JSON fields, or raw text?

#### Questions for Product Owner (Balaji):
1. **Web App Scope:** Should the web frontend become the full web application for all users, or remain a landing page that opens a web app demo?
2. **Missing Tabs:** For tabs like `Destinations`, `Calendar`, and `Outfit Ideas` in the Studio sidebar, should they be hidden for the MVP release, or should we build placeholder cards?
3. **Guest Mode vs. Mandatory Auth:** Can users generate an outfit as a guest using temporary local storage before being prompted to sign up?

---

## D. Recommended First Three Implementation Tasks

These tasks are ordered by **product priority (P0)**, **business impact**, and **feasibility for a junior frontend developer**, ensuring foundational building blocks are established before complex features are attempted.

---

### Task 1: Build the Core API Client & Authentication Layer (P0)
- **Objective:** Create the network foundation and implement real Login/Register modals connected to the existing backend auth routes.
- **Why First:** Every subsequent feature (fetching the user's real wardrobe, saving outfits, generating recommendations) requires authenticated user context (`Authorization: Bearer <token>`). Without this, the app cannot transition beyond mock data.
- **Scope & Deliverables:**
  1. Add `.env.example` and `.env` with `VITE_API_BASE_URL=http://localhost:5000/api/v1`.
  2. Create `src/lib/api-client.ts` using native `fetch` with token injection and error handling.
  3. Create `src/services/auth.service.ts` with `login()`, `register()`, `logout()`, `getMe()`.
  4. Create `src/context/AuthContext.tsx` to hold the authenticated user state.
  5. Build `src/components/AuthModal.tsx` with email/password inputs, validation, loading spinner, and error banners.
  6. Connect the "Sign In" button in [Navbar.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/Navbar.tsx) to open `AuthModal`.
- **Dependencies:** Backend auth endpoints (`/api/v1/auth/login`, `/api/v1/auth/register`).

---

### Task 2: Build the Reusable UI Component Library & Fix Mobile Navigation (Foundation)
- **Objective:** Establish the atomic design system requested in Section 10 and fix the mobile navigation bug in Studio mode.
- **Why Second:** A junior engineer can work cleanly and rapidly on UI primitives. This eliminates thousands of lines of duplicated Tailwind classes and fixes the unusable mobile view.
- **Scope & Deliverables:**
  1. Create `src/components/ui/`:
     - `Button.tsx` (primary, secondary, gold, outline, loading state with spinner, disabled).
     - `IconButton.tsx` (accessible `aria-label`, tooltip support).
     - `Input.tsx` & `Select.tsx` (error message states, focused gold rings).
     - `Chip.tsx` (selected, unselected, removable).
     - `Skeleton.tsx` (shimmer animation for cards and garment grids).
     - `EmptyState.tsx` (icon, title, subtitle, CTA button).
  2. Create a persistent `BottomNav.tsx` component visible on viewports `< 768px` in [AppStudio.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AppStudio.tsx) with tabs: **Home, Closet, Stylist, Try-On, Profile**.
- **Dependencies:** None (Pure React/Tailwind frontend task).

---

### Task 3: Complete the Digital Closet CRUD & Connect to Backend Wardrobe API (P0)
- **Objective:** Transform the Digital Closet from a static display into a functional CRUD interface connected to `/api/v1/wardrobe`.
- **Why Third:** The closet is the core data asset of OTD. Outfit generation cannot produce personalized results without real user garments.
- **Scope & Deliverables:**
  1. Create `src/services/wardrobe.service.ts` (`getItems()`, `addItem()`, `deleteItem()`, `updateItem()`).
  2. Implement client-side search input and filter chips (formality, category, color) in the closet view.
  3. Wire [AddPieceModal.tsx](file:///c:/Users/pc/Desktop/OTD/web/src/components/AddPieceModal.tsx) to a real `<input type="file" accept="image/*">` that previews the selected image file.
  4. Implement item deletion with a confirmation dialog triggering `DELETE /api/v1/wardrobe/:id`.
  5. Add an `EmptyState` when the wardrobe has 0 items ("Your closet is empty. Add your first piece to unlock AI styling").
- **Dependencies:** Task 1 (Auth token for API calls) and Task 2 (Reusable Button, Input, Modal, and EmptyState components).

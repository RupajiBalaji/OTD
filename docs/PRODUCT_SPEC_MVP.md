# OTD (Outfit Of The Day) — Core MVP Product Blueprint & Flow

> **Core Product Thesis**: OTD is not a static catalog or generic moodboard. It is an **intelligent, context-driven personal stylist that dresses you from your own closet**.

---

## 🧭 The Core User Journey

```
1. User Profile & Style DNA
   ↓
2. Home: "Where are you going?"
   ↓
3. Context Capture: Destination, Occasion, Mood/Vibe, Time/Weather
   ↓
4. Digital Closet Scan (User's Actual Owned Clothes)
   ↓
5. AI Curation Engine & Harmony Scoring
   ↓
6. OTD Result: Curated Look of the Day
   ↓
7. "Why this outfit?" Editorial Rationale
   ↓
8. Chat / Conversational Modifier ("Make it more casual", "Change the shoes", "No jeans")
   ↓
9. Save Look & Wear Log
```

---

## 📱 The 5 Core MVP Modules & Screen Breakdown

### Module 1: User Profile & Style Calibration (Onboarding / Settings)
*Purpose: Establish baseline biometric and aesthetic rules so the AI never recommends silhouettes or palettes that clash with the user's natural frame.*

- **Biometric & Physical Anchors**:
  - Height & silhouette / body proportions.
  - Skin tone / undertone palette calibration (e.g., warm, cool, olive, neutral).
- **Style Personas (Select 1–3)**:
  - *Clean Minimalist*, *Old Money / Heritage*, *Smart Sartorial / Tailored*, *Relaxed Contemporary*, *Streetwear / Edgy*.
- **Fit & Proportions Preferences**:
  - Preferred tops fit: *Slim / Tailored*, *Regular*, *Relaxed / Oversized*.
  - Preferred bottoms fit: *Tapered*, *Straight leg*, *Wide-leg / Relaxed*.
- **Disliked Elements (Blacklist)**:
  - Fabrics/cuts user refuses to wear (e.g., *"No polyester"*, *"No skinny fits"*, *"No loud logos"*).

---

### Module 2: The Home Screen — Context-First ("Where are you going?")
*Purpose: Replace static outfit cards with a dynamic context prompt. The outfit is the **result**, not the starting point.*

- **Primary Input: Context Omnibar**:
  - Text or voice prompt: e.g., *"Dinner date tonight at a breezy rooftop lounge in Mumbai"* or *"Investor pitch meeting at 10 AM tomorrow"*.
- **Guided Quick Context Selectors** (for 3-second rapid entry):
  - **Venue & Setting**: Rooftop / Lounge, Executive Office, Casual Cafe, Fine Dining, Club / Nightlife, Airport / Travel, Wedding / Gala.
  - **Occasion**: Date Night, High-Stakes Meeting, Casual Social, Formal Celebration, Off-Duty Weekend.
  - **Desired Vibe / Mood**: *Effortless Elegance*, *Power & Authority*, *Low-Key Relaxed*, *Alluring & Confident*, *Sharp Modern*.
  - **Time & Climate Telemetry**: Auto-synced weather & hour (e.g., *Evening · 24°C · 60% Humidity · Light Breeze*).

---

### Module 3: Digital Closet & Camera Intake
*Purpose: Provide the inventory pool from which the AI builds outfits.*

- **MVP Garment Metadata Schema**:
  - **Core Category**: Tops, Bottoms, Outerwear, Footwear, Accoutrements.
  - **Sub-Type**: e.g., Knit rollneck, Oxford shirt, Pleated trouser, Denim, Loafer, Sneaker, Chelsea boot.
  - **Primary & Secondary Colors**: Normalized color family.
  - **Fit & Drape**: Tailored, Regular, Oversized.
  - **Formality Rating**: Casual (1) to Ultra-Formal (5).
  - **Seasonality / Fabric Weight**: Lightweight summer, Midweight all-season, Heavy winter.
- **Add Piece / Upload Pipeline**:
  `Take Photo / Upload` → `AI identifies category, color, fit, formality` → `User confirms/edits chip sheet` → `Added to Digital Closet`.

---

### Module 4: The Curated Outfit & "Why This Outfit?"
*Purpose: Present the tailored combination with transparent rationale.*

- **The Visual Ensemble**:
  - Clean composition showing the exact pieces from the user's closet:
    - Layer 1: Top / Base
    - Layer 2: Bottoms
    - Layer 3: Outerwear / Jacket (if weather/occasion calls for it)
    - Base: Footwear
    - Finishing Touch: Watch / Belt / Bag
- **"Why This Outfit?" Editorial Card**:
  - **Venue Matching**: *"Chosen because the textured knit balances the relaxed rooftop setting without looking underdressed."*
  - **Weather Comfort**: *"Optimized for 22°C evening breeze with breathable natural fibers."*
  - **Palette Harmony**: Color harmony score and complementary contrast rationale.

---

### Module 5: Conversational Modifier (Chat & Tweak Engine)
*Purpose: Give the user full control to iterate without starting from scratch.*

- **Quick Tweak Chips**:
  - `Make it more casual`
  - `Change the shoes`
  - `Don't use jeans`
  - `Make it more attractive / date-ready`
  - `Add a lighter layer`
- **Natural Language Chat Bar**:
  - User types: *"I want to wear my leather Chelsea boots instead"* or *"Swap the white shirt for something darker"*.
  - AI queries the closet for matching alternatives that preserve color harmony and event appropriateness.

---

### Module 6: Save Look & Wear Logging
- **Save to Favorites**: Pin favorite ensembles for future instant reuse.
- **"Mark as Worn Today"**:
  - Logs the date and event.
  - Prevents recommending the identical look to similar social circles within 14 days.

---

## 🚫 Out of Scope for MVP (Phase 2 & Phase 3 Roadmap)

| Feature | Phase | Rationale for MVP Postponement |
| :--- | :--- | :--- |
| **Virtual Try-On (VTO)** | Phase 2 | Requires high-latency 3D garment mesh simulation. Core styling utility must be proven first. |
| **Closet Valuation & Cost-Per-Wear** | Phase 2 | Financial analytics are engaging but do not assist the user in answering *"what do I wear tonight?"*. |
| **Social Community Feed** | Phase 3 | Community requires critical network mass; single-player utility must be extraordinary first. |
| **Wardrobe Gap Shopping Marketplace**| Phase 3 | Monetization layer; user must first trust OTD's curation of their existing clothes. |

---

## 🛠️ Team Alignment Specifications

### 1. For Vasant (Backend Architecture)
- **`POST /api/v1/profile`**: Stores biometrics, style personas, and fit preferences.
- **`POST /api/v1/closet/items`**: Ingests new clothing items with auto-extracted tags.
- **`GET /api/v1/closet`**: Filterable closet inventory by category, formality, and color.
- **`POST /api/v1/otd/generate`**:
  - *Payload*: `{ destination, occasion, vibe, time, weather, location }`
  - *Response*: `{ outfit: [itemId1, itemId2, ...], rationale: string, harmonyScore: number }`
- **`POST /api/v1/otd/modify`**:
  - *Payload*: `{ currentOutfitId, instruction: "Make it more casual" }`
  - *Response*: `{ updatedOutfit: [...], updatedRationale: string }`

### 2. For Piyush & Frontend Team
- **Component 1**: `ContextPromptBar` (Home screen hero with venue/vibe selector).
- **Component 2**: `ClosetInventoryGrid` (Filtered by Tops, Bottoms, Footwear, Outerwear).
- **Component 3**: `OutfitCanvas` (Crisp presentation of the selected items).
- **Component 4**: `StylistRationaleCard` (Why this outfit suits the setting).
- **Component 5**: `ConversationalModifierBar` (Interactive chips & text input).

### 3. For AI/ML Team
- **Context Parsing Prompt**: Extracts structured parameters `(venue_formality: 1-5, vibe_vector, temp_min, temp_max)` from raw prompts like *"Rooftop dinner date in Bandra"*.
- **Constraint Satisfaction Graph**: Filters closet items where `formality == venue_formality`, checks color harmony matrices, and satisfies layer thermal comfort.
- **Conversational Delta Engine**: Given an existing outfit and a delta instruction (`"Change shoes"`), re-executes search solely on the targeted category slot while keeping the rest locked.

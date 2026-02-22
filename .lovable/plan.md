
# Infinity Platform -- Full Page Build

## Overview
Build all remaining pages for the Infinity platform (13+ pages) while preserving the existing homepage ("Ground Zero"). All pages share a consistent layout shell with the existing sticky navbar and a new global footer. Client-side SEO via `react-helmet-async` provides per-route metadata, Open Graph tags, canonical URLs, and JSON-LD structured data.

---

## Architecture

### Routing (react-router-dom)
The existing single-route setup in `App.tsx` will be expanded to a full route tree. A shared `SiteLayout` wrapper provides the navbar, footer, chatbot launcher, and grain/sparkle overlays on every page.

```text
/                           -- Homepage (existing, untouched)
/the-trinity                -- Trinity hub
/the-trinity/nova           -- NOVA brand page
/the-trinity/live-the-moment-- LTM brand page
/the-trinity/x-force        -- X-Force brand page
/editions                   -- Editions landing (ecommerce)
/editions/c/:categorySlug   -- Category / PLP
/editions/p/:productSlug    -- Product detail / PDP
/cart                       -- Cart
/checkout                   -- Checkout
/order/confirmed/:orderId   -- Order confirmation
/encounter                  -- Encounter landing (events)
/encounter/e/:eventSlug     -- Event detail
/encounter/checkout/:eventId-- Ticket checkout
/encounter/confirmed/:id    -- Ticket confirmation
/account                    -- Account dashboard
/account/orders             -- Order history
/account/orders/:orderId    -- Order detail
/account/addresses          -- Saved addresses
/account/wishlist           -- Wishlist
```

### Navbar Update
The existing `Navbar` component will be refactored from a scroll-based section navigator into a full router-aware navigation bar:
- On the homepage: keeps current scroll behavior
- On other pages: links use `react-router-dom` `Link` components
- "The Trinity" dropdown items link to `/the-trinity/nova`, etc.
- Shopping bag icon links to `/cart`
- User icon links to `/account`
- Active state derived from current route (using `useLocation`)
- Mobile hamburger menu added for smaller screens

### Shared Layout Shell (`SiteLayout`)
Wraps all pages with:
- Sticky navbar (existing, adapted for routing)
- `GrainOverlay` + `GlobalSparkles` (existing)
- Footer component (new)
- Floating chatbot launcher button (new)
- `react-helmet-async` provider

---

## Mock Data Layer

### TypeScript Interfaces (`src/types/`)
- `Product`, `Variant`, `Category`
- `Event`, `TicketTier`
- `CartItem`, `Cart`, `Order`, `OrderLineItem`
- `TicketOrder`
- `UserProfile`, `Address`

### Mock Data Files (`src/data/`)
- `products.ts` -- 8-12 mock products across 3-4 categories with variants
- `categories.ts` -- 4 categories (Apparel, Accessories, Footwear, Limited Drops)
- `events.ts` -- 4-6 mock events with ticket tiers
- `brands.ts` -- Brand story content for Nova, LTM, X-Force
- Uses existing asset images where possible

---

## CMS-like Reusable Blocks (`src/components/blocks/`)

Each block is a self-contained component that can be composed on any page:

| Block | Description |
|-------|-------------|
| `HeroBlock` | Full-width image/video hero with title overlay |
| `EditorialText` | Large typography text section with heading + body |
| `MediaGallery` | Responsive image/video grid |
| `SplitFeature` | Side-by-side image + copy layout |
| `QuoteBlock` | Centered testimonial/quote with attribution |
| `ProductCarousel` | Horizontal scrollable product cards |
| `EventCarousel` | Horizontal scrollable event cards |
| `CTABand` | Full-width call-to-action strip |
| `NewsletterModule` | Email signup form section |

---

## Page Specifications

### A) The Trinity Pages

**Trinity Hub (`/the-trinity`)**
- `HeroBlock` with editorial manifesto text
- 3 brand cards (using existing Trinity assets) linking to sub-pages
- `ProductCarousel` with "Featured Products" from mock data
- `EventCarousel` with "Featured Events" from mock data

**Brand Pages (`/the-trinity/nova`, `/live-the-moment`, `/x-force`)**
- `HeroBlock` with brand cover image (existing assets: `trinity-nova.jpg`, etc.)
- 2-3 `EditorialText` / `SplitFeature` blocks telling the brand story
- `ProductCarousel` filtered by brand
- `EventCarousel` filtered by brand
- `NewsletterModule` CTA
- "Related Brands" links at bottom

### B) Editions (Ecommerce)

**Editions Landing (`/editions`)**
- `HeroBlock` with intro
- Category tiles grid
- "Trending" `ProductCarousel`
- "New Drops" `ProductCarousel`
- CTA to browse all

**Category / PLP (`/editions/c/:categorySlug`)**
- Breadcrumbs
- Filter sidebar (price range, size, availability)
- Sort dropdown (featured, newest, price asc/desc)
- Product card grid with skeleton loaders
- Pagination controls
- Empty state when no results

**Product Detail (`/editions/p/:productSlug`)**
- Image gallery (thumbnail strip + main image)
- Title, price, variant selector (size/color), quantity, Add to Cart, Wishlist
- Description + specs in accordion
- Delivery/returns info
- "You May Also Like" `ProductCarousel`
- JSON-LD Product schema

**Cart (`/cart`)**
- Line items list (image, title, variant, quantity +/-, remove)
- Promo code input
- Order summary sidebar (subtotal, discount, total)
- "Proceed to Checkout" CTA
- Empty cart state

**Checkout (`/checkout`)**
- Stepper: Info > Shipping > Payment > Review
- Guest checkout with login link
- Address form
- Payment method placeholder (Bangladesh gateway UI)
- Order review + "Place Order" button
- Redirects to confirmation on success

**Order Confirmation (`/order/confirmed/:orderId`)**
- Success state with order summary
- "Download Invoice" button (placeholder)
- "Track Order" link (placeholder)

### C) Encounter (Event Ticketing)

**Encounter Landing (`/encounter`)**
- Featured event hero
- Event grid with filters (date, location, price)
- Sort (upcoming, newest)
- Event cards showing date, venue, from-price
- Skeleton loaders + empty state

**Event Detail (`/encounter/e/:eventSlug`)**
- Event banner hero
- Date/time, venue, map placeholder
- Description + lineup/schedule
- Ticket tier selector (tier name, price, remaining qty)
- Quantity + "Buy Tickets" CTA
- FAQ accordion
- JSON-LD Event schema

**Ticket Checkout (`/encounter/checkout/:eventId`)**
- Buyer info form (guest allowed)
- Tier selection recap
- Payment placeholder
- "Confirm Purchase" button

**Ticket Confirmation (`/encounter/confirmed/:id`)**
- Confirmation message
- "Download PDF Ticket" button (placeholder)
- "View QR Code" modal (placeholder)
- "Email sent" note

### D) Account Area

**Account Dashboard (`/account`)**
- Auth gate placeholder ("Sign in to continue")
- Dashboard cards: Recent Orders, Saved Addresses, Wishlist count

**Order History (`/account/orders`)**
- Order list table with status badges
- Link to individual order detail
- Empty state

**Order Detail (`/account/orders/:orderId`)**
- Order summary, items, status timeline

**Addresses (`/account/addresses`)**
- Address cards with edit/delete
- "Add New Address" form
- Empty state

**Wishlist (`/account/wishlist`)**
- Product card grid of wishlisted items
- Remove from wishlist action
- Empty state

---

## SEO Implementation

- Install `react-helmet-async`
- `SEOHead` component accepting title, description, canonical, OG image, JSON-LD object
- Applied per-page with appropriate metadata
- Breadcrumbs component for PLP, PDP, event detail pages

---

## Cart State Management

- React Context (`CartContext`) with `useReducer` for cart operations
- Actions: add item, remove item, update quantity, apply promo, clear cart
- Persisted to `localStorage`

---

## Footer Component

- 4-column layout: Brand info, Shop (Editions links), Experience (Encounter, Trinity), Support (Account, Contact placeholder)
- `NewsletterModule` integrated
- Social media icon links (placeholder)
- Copyright line

---

## Chatbot Launcher

- Floating button (bottom-right corner)
- Branded with Infinity gradient border glow
- Opens a placeholder chat modal on click

---

## Quality Standards

- Mobile-first responsive design throughout
- Skeleton loaders on all data-driven pages (PLP, PDP, events)
- Friendly empty states with illustrations/copy
- Keyboard-accessible focus states
- Sufficient color contrast (WCAG AA)
- Consistent use of existing design tokens (infinity-cyan, infinity-purple, infinity-pink)
- `ScrollReveal` animations on section entries
- Premium editorial typography using Outfit (display) + Space Grotesk (body)

---

## Technical Details

### New Dependencies
- `react-helmet-async` -- client-side meta tag management

### New Files (approximate count: 40+)

**Types & Data:**
- `src/types/index.ts`
- `src/data/products.ts`, `categories.ts`, `events.ts`, `brands.ts`

**Layout & SEO:**
- `src/components/layout/SiteLayout.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/ChatbotLauncher.tsx`
- `src/components/layout/Breadcrumbs.tsx`
- `src/components/SEOHead.tsx`

**CMS Blocks (9 files):**
- `src/components/blocks/HeroBlock.tsx`
- `src/components/blocks/EditorialText.tsx`
- `src/components/blocks/MediaGallery.tsx`
- `src/components/blocks/SplitFeature.tsx`
- `src/components/blocks/QuoteBlock.tsx`
- `src/components/blocks/ProductCarousel.tsx`
- `src/components/blocks/EventCarousel.tsx`
- `src/components/blocks/CTABand.tsx`
- `src/components/blocks/NewsletterModule.tsx`

**Shared Components:**
- `src/components/ProductCard.tsx`
- `src/components/EventCard.tsx`
- `src/components/SkeletonGrid.tsx`
- `src/components/EmptyState.tsx`
- `src/components/CartContext.tsx`

**Pages (20 files):**
- `src/pages/Index.tsx` (minor update for layout integration)
- `src/pages/trinity/TrinityHub.tsx`
- `src/pages/trinity/BrandPage.tsx` (shared for all 3 brands)
- `src/pages/editions/EditionsLanding.tsx`
- `src/pages/editions/CategoryPage.tsx`
- `src/pages/editions/ProductDetail.tsx`
- `src/pages/editions/Cart.tsx`
- `src/pages/editions/Checkout.tsx`
- `src/pages/editions/OrderConfirmation.tsx`
- `src/pages/encounter/EncounterLanding.tsx`
- `src/pages/encounter/EventDetail.tsx`
- `src/pages/encounter/TicketCheckout.tsx`
- `src/pages/encounter/TicketConfirmation.tsx`
- `src/pages/account/AccountDashboard.tsx`
- `src/pages/account/OrderHistory.tsx`
- `src/pages/account/OrderDetail.tsx`
- `src/pages/account/Addresses.tsx`
- `src/pages/account/Wishlist.tsx`

**Modified Files:**
- `src/App.tsx` -- full route tree + CartProvider + HelmetProvider
- `src/components/Navbar.tsx` -- route-aware navigation + mobile drawer
- `src/pages/Index.tsx` -- wrapped in SiteLayout

### Build Order
1. Types + mock data
2. Cart context
3. SEO + layout components (SiteLayout, Footer, Breadcrumbs, ChatbotLauncher)
4. CMS block components
5. Shared UI (ProductCard, EventCard, SkeletonGrid, EmptyState)
6. Navbar refactor (route-aware + mobile)
7. All pages (Trinity > Editions > Encounter > Account)
8. App.tsx route tree update

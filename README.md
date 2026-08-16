# PilotSDR Website — Version 1

A complete, responsive, multi-page marketing site built to the PilotSDR build guide.
Plain HTML + CSS + a little vanilla JS. No build step, no dependencies.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd pilotsdr
python3 -m http.server 8000
# visit http://localhost:8000
```

## Pages

| File | Page |
|---|---|
| `index.html` | Home (9 sections + FAQ) |
| `about.html` | About |
| `services.html` | Services (8 services) |
| `industries.html` | Industries (9 industries) |
| `case-studies.html` | Case Studies (3 placeholder studies) |
| `pricing.html` | Pricing (3 plans + FAQ) |
| `contact.html` | Contact (Calendly + form + map) |
| `blog.html` | Blog (4 placeholder posts) |

## Shared assets

- `css/styles.css` — the entire design system: color tokens, Poppins/Inter fonts,
  buttons (12px radius, soft shadow, hover-lift), cards, nav, footer, responsive rules,
  and calm scroll animations (fade + slide up).
- `js/main.js` — sticky nav (transparent on the homepage hero, solid on scroll),
  mobile hamburger menu, scroll-reveal, FAQ accordion, and front-end contact-form handling.

## Design rules (as built)

- **Colors** — Blue `#2563EB`, Dark `#111827`, Light `#F9FAFB`, Accent `#3B82F6`,
  Green `#10B981` (main "Book a Call" buttons only). All defined once as CSS variables.
- **Fonts** — Poppins (headings), Inter (body).
- **Buttons** — 12px rounded, soft shadow, lift on hover. Main CTA = green; secondary = blue/outline.
- **Animations** — fade-in + slide-up on scroll, small scale-up on card/button hover. Nothing flashy;
  respects `prefers-reduced-motion`.
- **Spacing** — generous section padding and white space.
- **Mobile** — every page is responsive down to small phones (single-column, hamburger nav).

## Things to swap before launch (clearly marked PLACEHOLDER)

- Trust-bar company logos ("Logo 1–5" gray boxes on the homepage).
- Testimonials (Home), case studies, blog posts, leadership bios — all labeled placeholder.
- Calendly link: replace the placeholder button/embed with the real inline embed
  (`calendly.com/pilotsdr/strategy-call`) in `contact.html`.
- Contact form: currently front-end only — connect it to your email service / backend.
- Google Map embed on the contact page (placeholder pin).
- OG images: each page references `assets/og-*.png` (1200×630) — add the real images.
- Real email/phone: `hello@pilotsdr.com` and the placeholder phone number.

## Final checklist (from the build guide)

- [x] Every button on every page says exactly what's written in the document
- [x] Every headline matches exactly what's written in the document
- [x] Colors match the hex codes in the guide — nowhere else
- [x] Fonts are Poppins (headings) and Inter (body) everywhere
- [x] All buttons have 12px rounded corners, a shadow, and lift slightly on hover
- [x] Every section fades/slides in gently on scroll — nothing flashy
- [x] Every page is responsive (single-column, hamburger menu on phones)
- [x] Every page has a Meta Title, Meta Description, and OG Image tag
- [x] Every page ends by pointing the visitor toward "Book a Strategy Call"
- [x] Placeholder content is clearly marked so it's easy to find and replace later

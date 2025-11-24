# VIDA Travel - Brand Design System

## Visual Identity

### Mission Statement
VIDA empowers Mexican families to achieve their travel dreams through transparent, interest-free credit. We believe everyone deserves vacation experiences, not just the wealthy.

### Brand Personality
- **Warm**: Approachable, family-oriented, encouraging
- **Transparent**: Honest about costs, clear calculations, no hidden fees
- **Optimistic**: Celebrating dreams, progress, and achievements
- **Trustworthy**: Professional, secure, reliable financial partner

---

## Color Palette

### Primary Colors

**Deep Teal** `#004E50`
- **Usage**: Primary text, buttons, CTAs, headlines
- **RGB**: 0, 78, 80
- **Symbolism**: Trust, stability, professionalism
- **Contrast**: WCAG AAA on white backgrounds (10.2:1)

**Warm Gold** `#C3A574`
- **Usage**: Secondary accents, highlights, success states, premium features
- **RGB**: 195, 165, 116
- **Symbolism**: Aspiration, achievement, warmth
- **Contrast**: WCAG AA on dark backgrounds (4.8:1)

### Supporting Colors

**Light Teal** `#84C6C1`
- **Usage**: Interactive states, hover effects, data visualizations, progress bars
- **RGB**: 132, 198, 193
- **Symbolism**: Growth, progress, freshness

**Off-White** `#FAF9F6`
- **Usage**: Background, light sections, card backgrounds
- **RGB**: 250, 249, 246
- **Symbolism**: Cleanliness, simplicity, breathing room

**Charcoal** `#2E3A3B`
- **Usage**: Body text, dark UI elements, footer
- **RGB**: 46, 58, 59
- **Contrast**: WCAG AAA on white (12.4:1)

### Gradients

**Teal-to-Gold Gradient**
```css
linear-gradient(135deg, #004E50 0%, #C3A574 100%)
```
- **Usage**: Hero sections, premium features, celebration moments, logo overlays

**Light Teal Fade**
```css
linear-gradient(180deg, #84C6C1 0%, rgba(132, 198, 193, 0) 100%)
```
- **Usage**: Section dividers, subtle backgrounds

---

## Typography

### Font Families

**Headlines & Display**: **Montserrat** or **Poppins**
- Weights: 600 (SemiBold), 700 (Bold)
- Characteristics: Modern, geometric, clean
- Usage: H1, H2, H3, CTA buttons, feature titles

**Body Copy**: **Lora** or **Merriweather**
- Weights: 400 (Regular), 500 (Medium)
- Characteristics: Serif, readable, warm
- Usage: Paragraphs, descriptions, explanations

**UI Elements**: **Montserrat** or **Poppins**
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold)
- Characteristics: Clear, legible, professional
- Usage: Labels, buttons, form inputs, navigation

### Type Scale

```
H1: 48px / 3rem    - Line height: 1.2  - Letter spacing: -0.02em
H2: 36px / 2.25rem - Line height: 1.3  - Letter spacing: -0.01em
H3: 28px / 1.75rem - Line height: 1.4  - Letter spacing: 0
H4: 24px / 1.5rem  - Line height: 1.4  - Letter spacing: 0
H5: 20px / 1.25rem - Line height: 1.5  - Letter spacing: 0.01em
Body Large: 18px   - Line height: 1.6  - Letter spacing: 0
Body: 16px         - Line height: 1.6  - Letter spacing: 0
Small: 14px        - Line height: 1.5  - Letter spacing: 0.01em
Caption: 12px      - Line height: 1.4  - Letter spacing: 0.02em
```

### Responsive Typography

**Mobile (< 768px)**
- H1: 32px
- H2: 28px
- H3: 24px
- Body: 16px

**Tablet (768px - 1023px)**
- H1: 40px
- H2: 32px
- H3: 26px
- Body: 16px

**Desktop (≥ 1024px)**
- H1: 48px
- H2: 36px
- H3: 28px
- Body: 18px

---

## UI Components

### Buttons

**Primary Button**
- Background: Deep Teal (#004E50)
- Text: Off-White (#FAF9F6)
- Padding: 16px 32px
- Border-radius: 8px
- Font: Montserrat Medium, 16px, uppercase, letter-spacing: 0.05em
- Transition: 350ms ease
- Hover: Background becomes 10% lighter, subtle box-shadow

**Secondary Button**
- Background: Warm Gold (#C3A574)
- Text: Deep Teal (#004E50)
- Same dimensions as primary
- Hover: Background becomes 10% darker

**Tertiary/Ghost Button**
- Background: Transparent
- Border: 2px solid Deep Teal
- Text: Deep Teal
- Hover: Background fills with Light Teal

### Cards

**Standard Card**
- Background: Off-White (#FAF9F6)
- Border-radius: 12px
- Box-shadow: 0 4px 12px rgba(0, 78, 80, 0.1)
- Padding: 24px
- Transition: 300ms ease
- Hover: Box-shadow: 0 8px 24px rgba(0, 78, 80, 0.15), translateY(-4px)

**Destination Card**
- Image overlay: Teal tint (mix-blend-mode: multiply, opacity: 20%)
- Price badge: Warm Gold background, white text
- Checkmark on selection: Animated check in Light Teal circle

### Progress Bars

**Savings Progress**
- Track: Light gray (#E5E7EB)
- Fill: Light Teal (#84C6C1)
- Height: 12px
- Border-radius: 6px
- Animated fill: 1.5s ease-out

**Milestone Markers**
- Gold dots at 25%, 50%, 75%, 100%
- Pulse animation when reached

### Form Inputs

**Text Input**
- Border: 1px solid #D1D5DB
- Border-radius: 8px
- Padding: 12px 16px
- Font: Montserrat Regular, 16px
- Focus: Border becomes Deep Teal, box-shadow: 0 0 0 3px rgba(0, 78, 80, 0.1)

**Date Picker**
- Native HTML5 input styled with custom appearance
- Disabled dates: Grayed out, no interaction
- Selected date: Light Teal background

**Labels**
- Font: Montserrat Medium, 14px
- Color: Charcoal (#2E3A3B)
- Margin-bottom: 8px

### Modals & Tooltips

**Modal**
- Backdrop: rgba(0, 0, 0, 0.6)
- Container: White background, border-radius: 16px
- Max-width: 600px
- Padding: 32px
- Close button: Top-right, Deep Teal

**Tooltip**
- Background: Light Teal (#84C6C1) at 15% opacity
- Border: 1px solid Light Teal
- Border-radius: 8px
- Padding: 12px 16px
- Font: Montserrat Regular, 14px
- Arrow: Matches background
- Appears on hover or focus (keyboard accessible)

---

## Iconography

### Style Guidelines
- **Type**: Line-based, outline icons
- **Stroke**: 2px consistent weight
- **Corners**: Rounded (border-radius on paths)
- **Size**: 24px standard (16px small, 32px large)
- **Color**: Deep Teal primary, Warm Gold for highlights

### Icon Library
Recommended: **Feather Icons** or **Heroicons**

**Essential Icons**
- `calendar`: Date selection
- `dollar-sign`: Financial calculations
- `users`: Traveler selection
- `check-circle`: Success states, milestones
- `info`: Tooltips, help text
- `chevron-right`: Navigation
- `chevron-left`: Back navigation
- `message-circle`: Chat widget
- `x`: Close buttons
- `menu`: Mobile navigation
- `credit-card`: Payment
- `airplane`: Travel/destination theme

---

## Imagery

### Photography Style

**Destination Photos**
- High resolution (min 1920px width)
- Natural lighting preferred (golden hour, bright daylight)
- Diverse representation: families, couples, solo travelers of various backgrounds
- Authentic moments: candid, joyful, relaxed
- Mexican locations: beaches, colonial cities, cultural sites

**Image Treatment**
- Teal overlay filter: `filter: sepia(20%) hue-rotate(150deg) saturate(1.2);`
- Subtle vignette on corners
- Brightness: +5-10% for warmth

**Optimization**
- Format: WebP with JPEG fallback
- Compression: 85% quality
- Responsive: srcset with 3 sizes (mobile, tablet, desktop)
- Lazy loading enabled

### Destination List
1. **Cancún**: Turquoise beaches, resort vibe
2. **Playa del Carmen**: Trendy, cenotes, Mayan ruins
3. **Tulum**: Bohemian, beachfront ruins, wellness
4. **Cabo San Lucas**: Desert meets sea, luxury
5. **Puerto Vallarta**: Colonial charm, jungle, beaches
6. **Mexico City**: Culture, history, gastronomy

---

## Layout & Spacing

### Grid System
- **Columns**: 12-column grid
- **Gutter**: 24px
- **Max-width**: 1280px
- **Margins**: 16px mobile, 32px tablet, 64px desktop

### Spacing Scale (8px base)
```
4px   - XXS (tight spacing)
8px   - XS  (component padding)
16px  - SM  (between elements)
24px  - MD  (between sections)
32px  - LG  (major sections)
48px  - XL  (page sections)
64px  - XXL (hero sections)
96px  - XXXL (homepage divisions)
```

### Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm - Large phones */ }
@media (min-width: 768px)  { /* md - Tablets */ }
@media (min-width: 1024px) { /* lg - Laptops */ }
@media (min-width: 1280px) { /* xl - Desktops */ }
@media (min-width: 1536px) { /* 2xl - Large screens */ }
```

---

## Animations & Interactions

### Transition Timing
- **Fast**: 150ms - Hover states, color changes
- **Standard**: 300ms - Most interactions, button clicks
- **Smooth**: 500ms - Panels, modals, larger movements
- **Slow**: 1000ms+ - Progress bars, celebration animations

### Easing Functions
- `ease-out`: User-initiated actions (clicks, hovers)
- `ease-in`: Element leaving screen
- `ease-in-out`: Smooth back-and-forth (modals, panels)

### Micro-animations
- **Button Click**: Slight scale(0.98) + shadow reduction
- **Card Hover**: translateY(-4px) + shadow increase
- **Checkbox Selection**: Checkmark draws in with stroke-dashoffset
- **Milestone Achievement**: Confetti burst + scale pulse
- **Progress Fill**: Linear animation from 0 to target over 1.5s

### Loading States
- **Spinner**: Rotating circle, Light Teal color, 32px
- **Skeleton**: Pulsing gray placeholder, border-radius matches content
- **Progress Bar**: Indeterminate loading with sliding gradient

---

## Accessibility

### Color Contrast
- **AAA Standard** (7:1): Deep Teal on Off-White = 10.2:1 ✓
- **AA Standard** (4.5:1): Warm Gold on Charcoal = 4.8:1 ✓
- Never use Light Teal for body text (insufficient contrast)

### Keyboard Navigation
- **Tab Order**: Logical, top-to-bottom, left-to-right
- **Focus Indicators**: 2px solid Warm Gold outline with 2px offset
- **Skip Links**: "Skip to main content" at top
- **Escape Key**: Closes modals and tooltips

### Screen Readers
- **Alt Text**: Descriptive, in Spanish and English
- **aria-label**: All interactive elements
- **aria-describedby**: Form inputs with error messages
- **aria-live**: Dynamic content updates (calculator results)
- **Landmarks**: Semantic HTML5 (header, nav, main, aside, footer)

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Tone of Voice

### Spanish (Primary Language)

**Characteristics**
- **Tú** form: Friendly, approachable (not formal "usted")
- **Encouraging**: "¡Tú puedes lograrlo!"
- **Transparent**: Clear explanations, no jargon
- **Action-oriented**: Strong verbs, clear CTAs

**Examples**
- ❌ Formal: "Usted puede solicitar un préstamo..."
- ✓ VIDA: "Solicita tu crédito sin intereses hoy"

- ❌ Jargon: "Amortización del 20% con tasa cero..."
- ✓ VIDA: "Nosotros cubrimos el 20% sin intereses"

- ❌ Passive: "Es posible viajar en 12 semanas..."
- ✓ VIDA: "¡Viajarás en solo 12 semanas!"

### English (Secondary)

**Characteristics**
- **Conversational**: "Here's how it works..."
- **Optimistic**: Focus on possibilities, not limitations
- **Simple**: Short sentences, clear explanations

---

## Logo Usage

### File Format
- **Primary**: `Logo_1.0.png` (transparent background)
- **Formats**: PNG (web), SVG (scalable), PDF (print)

### Sizing
- **Header**: 180px width desktop, 120px mobile
- **Footer**: 100px width
- **Favicon**: 16x16, 32x32, 180x180

### Clear Space
- Minimum clear space: Height of the "V" in VIDA on all sides
- Never place logo on busy backgrounds without sufficient contrast

### Color Variations
- **Full Color**: Primary (teal/gold gradient)
- **Monochrome Dark**: Deep Teal (#004E50) for light backgrounds
- **Monochrome Light**: Off-White (#FAF9F6) for dark backgrounds

### Don'ts
- Don't rotate or skew the logo
- Don't change the color gradient
- Don't add effects (drop shadows, glows, outlines)
- Don't stretch or compress (maintain aspect ratio)

---

## Gamification Elements

### Progress Visualization
- **Weekly Savings Timeline**: Horizontal bar with week markers
- **Percentage Complete**: Large circular progress (0-100%)
- **Countdown**: Days/weeks until earliest travel date

### Milestone Celebrations
- **25% Saved**: "¡Vas por buen camino!" + small confetti
- **50% Saved**: "¡A mitad del camino!" + badge animation
- **75% Saved**: "¡Casi listo para viajar!" + star burst
- **100% Saved**: "¡Listo para reservar tu viaje!" + full celebration

### Achievement Badges
- Simple line icons with fill animation
- Gold color for achievements
- Teal for ongoing progress

### Sound Design (Optional)
- **Success**: Gentle chime (C major chord)
- **Milestone**: Celebratory bell
- **Error**: Soft error tone (non-jarring)
- **Must include**: User preference to disable

---

## Responsive Design Strategy

### Mobile-First Approach
1. Design for 375px width first (iPhone standard)
2. Single column layouts
3. Touch targets minimum 44x44px
4. Bottom-sheet modals instead of centered
5. Sticky CTAs at bottom of screen

### Tablet (768px+)
- Two-column layouts where appropriate
- Larger cards with more whitespace
- Side-by-side form fields

### Desktop (1024px+)
- Three-column grids for destination cards
- Side-by-side: calculator + visualization
- Persistent chat widget (bottom-right)
- Hover states enabled

---

## Component Examples

### Destination Card
```
┌──────────────────┐
│  [Image: Cancún] │ ← Teal overlay on hover
│                  │
│  🏖️ Cancún       │ ← Montserrat SemiBold, 20px
│  Desde $15,000   │ ← Lora Regular, 16px, Warm Gold
│                  │
│  [✓ Seleccionado]│ ← Light Teal background when selected
└──────────────────┘
```

### Calculator Result Card
```
┌────────────────────────────────┐
│  Tu Plan de Ahorro             │ ← H3, Deep Teal
│                                │
│  Ahorro Total: $30,000         │ ← Large number, Montserrat Bold
│  Crédito VIDA: $7,500 (0% ↗)  │ ← Warm Gold, arrow up animation
│  ────────────────────────      │ ← Progress bar: Light Teal fill
│  80%                     20%   │
│                                │
│  Fecha Más Cercana: 15 Jun 25  │ ← Calendar icon + date
│  [Continuar] →                 │ ← Primary button, right arrow
└────────────────────────────────┘
```

---

## Print & Marketing Materials

### Business Cards
- Deep Teal background
- Off-White text
- Warm Gold accent line
- Logo: Monochrome light version

### Social Media
- **Instagram**: 1080x1080px, teal/gold gradients, lifestyle imagery
- **Facebook**: 1200x630px, clear CTAs, destination photos
- **Templates**: Canva-compatible with brand colors/fonts

---

**Version**: 1.0  
**Last Updated**: November 2024  
**Status**: Active Brand Guidelines  
**Contact**: brand@vidatravel.com

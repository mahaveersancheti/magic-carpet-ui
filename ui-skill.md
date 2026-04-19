---
name: magiccarpet-ui
description: >
  Use this skill before building ANY UI component, page, dashboard, form,
  widget, menu, modal, or visual element. It defines the Magic Carpet design
  system — neumorphic style, exact color tokens, typography, shadow rules,
  and component patterns — that every piece of UI must follow precisely.
  Trigger on any request containing: "UI", "component", "page", "menu",
  "dashboard", "form", "card", "widget", "modal", "layout", "design",
  "screen", "interface", or "build me a...".
---

# Magic Carpet UI Design System — Agent Skill

## 0. Prime Directive

Before writing a single line of HTML/CSS, read this entire file.
Every UI you produce MUST conform to this system — no exceptions.
Do NOT default to generic Tailwind, Bootstrap, or plain-white card styles.
The Magic Carpet aesthetic is: **neumorphic + bold crimson accents + Sora/DM Sans typography**.


## 1. Core Philosophy

- **Neumorphism** — elements appear extruded from (raised) or pressed into (inset) the background. Every surface has a light-source shadow pair: dark shadow bottom-right, light shadow top-left.
- **Crimson as the hero color** — primary actions, active states, badges, and gradients all pull from `--crimson → --orange → --gold`.
- **Navy for authority** — headings, logos, and high-contrast text use `--navy`.
- **Softness + depth** — nothing is flat or harsh. Rounded corners everywhere (12–20px). Smooth transitions on all interactive elements.


## 2. CSS Variables — Copy These Exactly

Always declare these in `:root`. Never hardcode hex values anywhere in your CSS.

```css
:root {
  --navy:    #1C2033;   /* headings, logo, high-contrast text */
  --crimson: #C8102E;   /* primary CTA, active states, accents */
  --orange:  #E8821A;   /* gradient mid, warnings */
  --gold:    #F5A623;   /* badges, highlights, stat accents */
  --bg:      #DDE2E9;   /* page/body background */
  --card:    #E4E9F0;   /* raised card surface */
  --card-up: #EDF1F7;   /* elevated card (hover state surface) */
  --sd:      rgba(163,177,194,0.7);   /* dark shadow (bottom-right) */
  --sl:      rgba(255,255,255,0.85);  /* light shadow (top-left) */
  --text:    #1C2033;   /* body text */
  --mid:     #4A5568;   /* secondary text, nav labels */
  --muted:   #7A8799;   /* placeholder, section labels, hints */
  --white:   #FFFFFF;
  --green:   #0D9E6E;   /* success, live status, positive delta */
}
```


## 3. Typography

Always import both fonts via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Size |
|---|---|---|---|
| Page/section headings | Sora | 800 | clamp(1.8rem, 3vw, 2.8rem) |
| Sub-headings / card titles | Sora | 700 | 15–18px |
| Section labels (nav, small caps) | Sora | 600 | 9.5–11px, letter-spacing: 0.1em, uppercase |
| Body text | DM Sans | 400 | 14–16px |
| Nav items / labels | DM Sans | 500 | 13–14px |
| Badges / pills | Sora | 700 | 10–11px |

Gradient text (for hero headings and stat values):
```css
background: linear-gradient(135deg, var(--crimson), var(--orange), var(--gold));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```


## 4. Shadow System — The Heart of Neumorphism

There are three shadow classes. Use them consistently:

### nm-raised (cards, panels, buttons — default elevated element)
```css
background: var(--card);
border-radius: 20px;
box-shadow: 8px 8px 20px var(--sd), -6px -6px 16px var(--sl);
```

### nm-inset (inputs, search fields, active backgrounds, code areas)
```css
background: var(--bg);
border-radius: 16px;
box-shadow: inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl);
```

### nm-flat (secondary cards, icon containers, chips)
```css
background: var(--card);
border-radius: 16px;
box-shadow: 4px 4px 12px var(--sd), -3px -3px 10px var(--sl);
```

**Hover rule:** On hover, increase shadow depth slightly and add `transform: translateY(-2px)` or `translateX(2px)` for nav items. Transition: `all 0.2s ease`.

**Active/pressed rule:** For pressed states, flip to inset shadow:
```css
box-shadow: inset 3px 3px 8px var(--sd), inset -2px -2px 6px var(--sl);
```


## 5. Button Styles

### Primary Button (crimson)
```css
background: var(--crimson);
color: white;
padding: 12px 24px;
border-radius: 14px;
font-family: 'Sora', sans-serif;
font-size: 14px; font-weight: 600;
border: none; cursor: pointer;
box-shadow: 6px 6px 18px rgba(200,16,46,0.38), -3px -3px 10px rgba(255,255,255,0.5);
transition: all 0.22s;
```
Hover: `transform: translateY(-2px); background: #a50d25; box-shadow: 8px 10px 24px rgba(200,16,46,0.48), -3px -3px 12px rgba(255,255,255,0.6);`

### Secondary Button (ghost neumorphic)
```css
background: var(--card);
color: var(--navy);
padding: 12px 22px;
border-radius: 14px;
font-family: 'Sora', sans-serif;
font-size: 14px; font-weight: 600;
border: none; cursor: pointer;
box-shadow: 6px 6px 16px var(--sd), -4px -4px 12px var(--sl);
transition: all 0.22s;
```
Hover: `transform: translateY(-2px);`


## 6. Badge / Pill Styles

```css
/* Gold (default count) */
.badge-gold {
  background: var(--gold); color: var(--navy);
  font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
}

/* Red (alert/urgent) */
.badge-red  { background: var(--crimson); color: white; }

/* Green (live/success) */
.badge-green { background: var(--green); color: white; }

/* Outline pill (for hero badges) */
.badge-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(200,16,46,0.08);
  border: 1px solid rgba(200,16,46,0.22);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 12px; font-weight: 600; color: var(--crimson);
  letter-spacing: 0.06em; text-transform: uppercase;
}
/* Add a pulsing dot inside outline pill: */
/* <span style="width:7px;height:7px;border-radius:50%;background:var(--gold);display:inline-block;animation:pulse 2s infinite;"></span> */
```

Pulse animation:
```css
@keyframes pulse {
  0%,100% { opacity:1; transform: scale(1); }
  50%      { opacity:0.6; transform: scale(1.3); }
}
```


## 7. Navigation / Sidebar Patterns

When building any nav or sidebar:

```css
/* Nav item default */
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 500;
  color: var(--mid); cursor: pointer;
  transition: all 0.18s;
}
.nav-item:hover {
  background: var(--card-up);
  box-shadow: 4px 4px 10px var(--sd), -2px -2px 7px var(--sl);
  color: var(--navy);
  transform: translateX(2px);
}

/* Active nav item */
.nav-item.active {
  background: var(--crimson); color: white;
  box-shadow: 5px 5px 16px rgba(200,16,46,0.42), -2px -2px 8px rgba(255,255,255,0.42);
}

/* Icon container inside nav */
.nav-icon {
  width: 32px; height: 32px; min-width: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 9px;
}

/* Section label (uppercase dividers) */
.nav-section-label {
  font-size: 9.5px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--muted);
  padding: 12px 10px 4px;
}

/* Divider between sections */
.nav-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200,16,46,0.15), transparent);
  margin: 6px 10px;
}
```

**Sidebar shell:**
```css
.sidebar {
  background: var(--card);
  box-shadow: 8px 0 32px rgba(28,32,51,0.14), -4px 0 14px rgba(255,255,255,0.75);
}
```


## 8. Card Components

### Stat Card
```html
<div style="background:var(--card);border-radius:18px;box-shadow:6px 6px 18px var(--sd),-4px -4px 12px var(--sl);padding:18px;">
  <div class="sc-label">Label</div>
  <div class="sc-val">$2.4M</div>        <!-- gradient text -->
  <div class="sc-delta">↑ 18% growth</div>  <!-- green, 11px -->
</div>
```

### Panel / Table Card
```css
.panel {
  background: var(--card);
  border-radius: 20px;
  box-shadow: 6px 6px 18px var(--sd), -4px -4px 12px var(--sl);
  padding: 20px 22px;
}
.panel-header {
  border-bottom: 1px solid rgba(200,16,46,0.1);
  padding-bottom: 12px; margin-bottom: 14px;
}
```

### User / Avatar Card (inset style)
```css
.user-card {
  background: var(--bg);
  border-radius: 14px;
  box-shadow: inset 3px 3px 9px var(--sd), inset -2px -2px 7px var(--sl);
  padding: 10px 12px;
}
```

### Avatar circle (gradient)
```css
.avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--crimson), var(--orange));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700; color: white;
}
```


## 9. Input / Search Fields

```css
.input-field {
  background: var(--bg);
  box-shadow: inset 4px 4px 10px var(--sd), inset -2px -2px 7px var(--sl);
  border-radius: 13px;
  border: none; outline: none;
  padding: 9px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: var(--text);
}
.input-field::placeholder { color: var(--muted); }
.input-field:focus {
  box-shadow: inset 5px 5px 12px var(--sd), inset -3px -3px 9px var(--sl),
              0 0 0 2px rgba(200,16,46,0.25);
}
```


## 10. Status Indicators

### Live / AI Copilot Pill
```html
<div style="display:flex;align-items:center;gap:8px;background:rgba(13,158,110,0.08);border:1px solid rgba(13,158,110,0.22);border-radius:13px;padding:9px 11px;">
  <div style="width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;"></div>
  <div>
    <p style="font-size:12px;font-weight:600;color:var(--green);">Copilot Active</p>
    <span style="font-size:10.5px;color:var(--muted);">Listening for cues...</span>
  </div>
</div>
```

### Status dot colors
| Status | Color |
|---|---|
| Active / Success / Closing | `var(--green)` |
| Warning / Negotiation | `var(--gold)` |
| Urgent / Alert / Demo | `var(--crimson)` |
| Discovery / Pending | `var(--orange)` |


## 11. Page Background & Layout

```css
body {
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  min-height: 100vh;
}

/* Standard max-width content wrapper */
.page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Sidebar + main layout */
.app-shell {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 32px 36px;
  overflow-y: auto;
}
```


## 12. Logo Mark Pattern

```html
<div style="width:42px;height:42px;background:var(--crimson);border-radius:13px;display:flex;align-items:center;justify-content:center;box-shadow:4px 4px 14px rgba(200,16,46,0.42),-2px -2px 8px rgba(255,255,255,0.55);">
  <!-- SVG icon in white -->
</div>
```
Brand name: `font-family:'Sora',sans-serif; font-weight:800; color:var(--navy);`
Brand tagline: `font-size:10px; font-weight:600; color:var(--crimson); letter-spacing:0.07em; text-transform:uppercase;`


## 13. Borders & Dividers

- Section dividers inside panels: `1px solid rgba(200,16,46,0.1)`
- Row dividers in tables/lists: `1px solid rgba(163,177,194,0.28)`
- Gradient dividers between nav sections: `background: linear-gradient(to right, transparent, rgba(200,16,46,0.15), transparent); height:1px;`
- Nav bottom border: `border-bottom: 1px solid rgba(200,16,46,0.12);`
- Never use solid black or gray borders.


## 14. Transitions & Animation Rules

- Default transition: `all 0.2s ease` or `all 0.18s`
- Sidebar collapse: `width 0.38s cubic-bezier(.77,0,.18,1)`
- Hover lift: `transform: translateY(-2px)` for cards/buttons
- Hover slide: `transform: translateX(2px)` for nav items
- Scroll-reveal: Use IntersectionObserver with `.visible` class toggle and `opacity 0→1 + translateY(20px→0)` transition
- Pulsing dot: `@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }`


## 15. Icons

- Use inline SVG icons only. No icon fonts or external icon libraries.
- Icon stroke: `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`
- Standard icon size: `width="16" height="16"` inside nav; `width="20" height="20"` for standalone.
- Inside a crimson active nav item, icons inherit `color: white`.
- In hover state, icon color becomes `var(--crimson)`.


## 16. Scrollbars

Always style scrollbars to match the theme:
```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(200,16,46,0.22); border-radius: 4px; }
::-webkit-scrollbar-track { background: transparent; }
```


## 17. Do's and Don'ts

### DO
- Use `var(--bg)` as the page background always
- Use neumorphic box-shadow pairs on every raised element
- Apply gradient text (`--crimson → --orange → --gold`) for hero numbers and headings
- Round all corners (12px minimum, 20px for large cards)
- Keep nav active state strictly crimson
- Use `Sora` for all display/heading/badge text
- Use `DM Sans` for all body/nav/label text

### DON'T
- Don't use flat white backgrounds — always use `var(--card)` or `var(--bg)`
- Don't use solid colored borders — use shadow-based depth instead
- Don't use external CSS frameworks (Bootstrap, Tailwind) — write vanilla CSS with these variables
- Don't use colors outside the defined palette
- Don't use `border-radius` below 10px on interactive elements
- Don't use `font-weight: 600` or `700` for body text — reserve those for Sora display elements
- Don't use drop shadows with color — only `var(--sd)` and `var(--sl)` for neumorphic shadows; crimson tint shadows only for crimson elements


## 18. Quick Checklist Before Generating UI

Before outputting any UI code, confirm:
- [ ] Google Fonts import included (Sora + DM Sans)
- [ ] All 11 CSS variables declared in `:root`
- [ ] Page background is `var(--bg)`
- [ ] All cards use `var(--card)` with neumorphic shadow pair
- [ ] Primary actions are `var(--crimson)` with crimson glow shadow
- [ ] Active states in nav are crimson
- [ ] Text hierarchy: navy headings → mid body → muted hints
- [ ] All corners rounded (≥12px)
- [ ] Transitions on all interactive elements
- [ ] No hardcoded hex colors anywhere in CSS
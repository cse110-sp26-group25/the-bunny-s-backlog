---
status: proposed
date: 2026-05-31
decision-makers: {Wayne}
consulted: {team — pending review on UI-Work}
informed: {Shawn, Kabyan, Sahana, Quinton, Pranav, Jordan, Hojoon}
---

# Mobile vs. Desktop Platform Detection

## Context and Problem Statement

The MVP requires "Parallel layout architecture optimized for both Mobile and
Desktop browsers" (mvp.md §3.A). Every screen needs a reliable, project-wide
signal that says *"render the mobile layout"* vs. *"render the desktop layout."*
An earlier exploration in `engine-and-deployment/mobdeskdet.html` answered that
locally with a user-agent regex, but the team has not yet committed to a shared
mechanism, and the per-screen prototype does not scale once we have a title
screen, settings screen, credits screen, and an in-game terminal that all need
to branch.

* decision driver 1 — the same answer must be available on every screen and in
  any future JS module (e.g. the typing terminal may want a virtual keyboard
  hint only on touch devices)
* decision driver 2 — the signal must agree with what CSS media queries see, so
  designers can author one set of breakpoints and JS doesn't disagree
* decision driver 3 — must work under Chrome DevTools device emulation, which
  the team uses for testing without physical hardware
* decision driver 4 — must not be fooled by modern iPadOS, which advertises a
  desktop user-agent string by default

## Considered Options

* **Viewport-width threshold** (`window.innerWidth <= 768`)
* **User-agent regex** — the approach used by the existing
  `engine-and-deployment/mobdeskdet.html` prototype
* **Feature detection** — `matchMedia('(pointer: coarse)')` +
  `navigator.maxTouchPoints`

## Decision Outcome

Chosen option: **viewport-width threshold (768 px)**, implemented as a tiny
shared utility at `src/platform.js` that toggles `body.mobile` / `body.desktop`
and exposes a `window.Platform` API.

The breakpoint matches the de-facto industry standard (Bootstrap `md`, Tailwind
`md`, Material `sm`) and aligns with the threshold designers will reach for
when writing media queries. It correctly classifies an iPad in portrait
(768 px wide) as mobile, which is the layout treatment we want for that form
factor regardless of what its user-agent says.

### Consequences

* Good:
  * Single source of truth shared by every screen — adding a new screen is one
    `<script src="/src/platform.js">` line.
  * Agrees with CSS `@media (max-width: 768px)` exactly, so the visual layout
    and any JS branching can never disagree.
  * Works under Chrome DevTools device emulation without special handling.
  * Re-evaluates on `resize` and `orientationchange`, so rotating a tablet or
    resizing a desktop window flips the layout live.
* Bad:
  * A user with a narrow desktop browser window will get the mobile layout.
    We accept this — that is what CSS media queries do too, and the resulting
    layout is still usable.
  * Viewport width alone does not tell us whether input is touch. If we later
    need that signal (e.g. show on-screen tap hints), we will add a separate
    `Platform.isTouch()` helper backed by `pointer: coarse`, rather than
    overloading the mobile flag.

### Rejected: User-agent regex

The prototype's `/iPhone|Android|iPad/i.test(navigator.userAgent)` misses
iPadOS-as-desktop, Surface tablets, and is opaque to DevTools emulation. The
broader web platform has been moving away from UA sniffing for a decade.
We will retire the prototype's detection in favour of the shared utility.

### Rejected: Feature detection (`pointer: coarse` + `maxTouchPoints`)

More technically correct as a "is this a touch device" check, but that is a
different question. Two-in-one laptops with touchscreens would receive the
mobile layout under this approach despite having a keyboard, full screen real
estate, and a desktop UA — which is the opposite of what designers want. We
may revisit this if we add features that genuinely depend on input modality
rather than screen size.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `src/platform.js` — shared mobile/desktop detection utility. Toggles
  `body.mobile` / `body.desktop` based on viewport width (≤768 px → mobile),
  re-evaluates on resize and orientation change, and exposes a
  `window.Platform` API for JS callers.
- Mobile layout overrides for the title, settings, and credits screens under
  `body.mobile` selectors.
- `ADRs/mobile-detection.md` — MADR documenting the viewport-width strategy
  and the rationale for retiring the earlier user-agent prototype.

/**
 * Platform detection utility for The Bunny's Backlog.
 *
 * Determines whether the current viewport should be treated as a
 * "mobile" or "desktop" layout based on viewport width, applies the
 * matching class to the document body so stylesheets can branch via
 * `body.mobile` / `body.desktop` selectors, and re-evaluates on
 * window resize and orientation change.
 *
 * Detection rationale (see ADRs/mobile-detection.md):
 * Viewport width is the source of truth — it matches what CSS media
 * queries already see, supports browser dev-tools emulation, and is
 * not fooled by iPadOS reporting a desktop user-agent.
 *
 * Public API (attached to `window.Platform`):
 *   - Platform.MOBILE_BREAKPOINT_PX  (number)  — boundary in CSS px
 *   - Platform.isMobile()            (boolean) — true when viewport <= breakpoint
 *   - Platform.getPlatform()         (string)  — "mobile" | "desktop"
 *   - Platform.refresh()             (void)    — re-evaluate and re-apply body class
 *
 * @module platform
 */
(function () {
  "use strict";

  /** Viewport width (CSS px) at or below which we treat the layout as mobile. */
  var MOBILE_BREAKPOINT_PX = 768;

  /** Debounce window (ms) for resize-driven re-evaluation. */
  var RESIZE_DEBOUNCE_MS = 100;

  var resizeTimerId = null;

  /**
   * Return true when the current viewport width qualifies as mobile.
   * @returns {boolean}
   */
  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT_PX;
  }

  /**
   * Return the platform label for the current viewport.
   * @returns {"mobile"|"desktop"}
   */
  function getPlatform() {
    return isMobile() ? "mobile" : "desktop";
  }

  /**
   * Apply the platform class to `<body>`, removing the opposite class so
   * stylesheets can rely on exactly one being present at any time.
   * Safe to call before `<body>` exists — it will no-op until it does.
   * @returns {void}
   */
  function applyPlatformClass() {
    var body = document.body;
    if (!body) {
      return;
    }
    var platform = getPlatform();
    body.classList.toggle("mobile", platform === "mobile");
    body.classList.toggle("desktop", platform === "desktop");
  }

  /**
   * Re-evaluate the current platform and update the body class.
   * Exposed so callers can force a refresh after they mutate layout.
   * @returns {void}
   */
  function refresh() {
    applyPlatformClass();
  }

  /**
   * Debounced resize handler — collapses bursts of resize events
   * (common while a user drags a window edge) into a single update.
   * @returns {void}
   */
  function onResize() {
    if (resizeTimerId !== null) {
      clearTimeout(resizeTimerId);
    }
    resizeTimerId = setTimeout(function () {
      resizeTimerId = null;
      applyPlatformClass();
    }, RESIZE_DEBOUNCE_MS);
  }

  /**
   * Orientation change handler — fires when the device rotates.
   * Runs immediately (no debounce) because rotation is a discrete event.
   * @returns {void}
   */
  function onOrientationChange() {
    applyPlatformClass();
  }

  // Run as early as possible so the body class is present before the
  // browser performs its first paint (avoids a flash of desktop layout
  // on mobile). If the script is loaded in <head> before <body> exists,
  // the first applyPlatformClass() will no-op and the DOMContentLoaded
  // listener below will take care of it.
  applyPlatformClass();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPlatformClass, { once: true });
  }

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onOrientationChange);

  // Expose the public API.
  window.Platform = {
    MOBILE_BREAKPOINT_PX: MOBILE_BREAKPOINT_PX,
    isMobile: isMobile,
    getPlatform: getPlatform,
    refresh: refresh,
  };
})();

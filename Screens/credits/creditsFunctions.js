"use strict";

/* ──────────────────────────────────────────────────
   MODULE: StarField
   Draws a parallax star field on a <canvas> element.
   Stars are split into three depth layers (near /
   mid / far) that twinkle at different rates to
   reinforce the sense of deep space.
────────────────────────────────────────────────── */
const StarField = (() => {
  /* ── Private state ── */
  let canvas,
    ctx,
    stars = [];

  /* Configuration constants — adjust for different feels */
  const CONFIG = {
    STAR_COUNT: 220, // total stars across all layers
    LAYER_RATIOS: [0.2, 0.4, 0.4], // near : mid : far distribution
    LAYER_SIZES: [2.2, 1.4, 0.7],
    LAYER_ALPHA: [0.95, 0.65, 0.35],
    TWINKLE_SPEED: 0.012, // base twinkle phase increment per frame
  };

  /* Creates one star with randomised properties */
  function createStar(layer) {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: CONFIG.LAYER_SIZES[layer] * (0.5 + Math.random() * 0.5),
      baseAlpha: CONFIG.LAYER_ALPHA[layer],
      alpha: CONFIG.LAYER_ALPHA[layer],
      phase: Math.random() * Math.PI * 2, // starting phase for twinkle
      speed: CONFIG.TWINKLE_SPEED * (0.5 + Math.random()) * (layer + 1) * 0.5,
      layer,
    };
  }

  /* Populates the stars array from scratch */
  function populate() {
    stars = [];
    const total = CONFIG.STAR_COUNT;
    CONFIG.LAYER_RATIOS.forEach((ratio, layer) => {
      const count = Math.round(total * ratio);
      for (let i = 0; i < count; i++) stars.push(createStar(layer));
    });
  }

  /* Draws and updates every star for one animation frame */
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      // Advance twinkle phase
      star.phase += star.speed;
      // Map sine to [0.2, 1.0] so stars never vanish completely
      star.alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(star.phase));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha.toFixed(3)})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  /* Keeps the canvas pixel-perfect on resize */
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reposition stars so they spread across the new dimensions
    stars.forEach((s) => {
      s.x = Math.random() * canvas.width;
      s.y = Math.random() * canvas.height;
    });
  }

  /* Public API */
  function init() {
    canvas = document.getElementById("starfield");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    populate();
    render();
    window.addEventListener("resize", resize);
  }

  return { init };
})();

/* ──────────────────────────────────────────────────
   MODULE: CreditsCrawl
   Controls the CSS animation on the crawl track.
   Exposes pause / resume and a speed-change method
   that recalculates the remaining animation duration
   so the position stays continuous through speed
   changes (no jump cuts).
────────────────────────────────────────────────── */
const CreditsCrawl = (() => {
  /* ── Private state ── */
  let track;
  let rafId = null;
  let paused = false;
  let startY = 0; // px: starting translateY (below viewport)
  let endY = 0; // px: ending translateY   (fully above viewport)
  let currentY = 0; // px: current translateY
  let lastTime = null; // ms: timestamp of previous rAF tick
  let pxPerSecond = 0; // current scroll speed

  /* Base duration from the CSS token — parsed once */
  const BASE_DURATION = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--crawl-duration",
    ),
  );

  /* Calculate pixel distances based on live DOM measurements.
     Called once on start (and could be called on resize). */
  function measure() {
    const vh = window.innerHeight;
    startY = vh * 1.05; // 5% below bottom of viewport
    endY = -(track.scrollHeight + vh); // fully above top of viewport
  }

  /* The rAF loop — advances currentY each frame */
  function tick(timestamp) {
    if (paused) return;

    if (lastTime !== null) {
      const delta = (timestamp - lastTime) / 1000; // seconds since last frame
      currentY -= pxPerSecond * delta;

      // Clamp so we don't scroll past the end
      if (currentY <= endY) {
        currentY = endY;
        track.style.transform = `translateY(${currentY}px)`;
        return; // stop the loop — all content has passed
      }

      track.style.transform = `translateY(${currentY}px)`;
    }

    lastTime = timestamp;
    rafId = requestAnimationFrame(tick);
  }

  /* ── Public methods ── */

  function start() {
    measure();
    currentY = startY;
    // Speed in px/s so the full journey takes BASE_DURATION seconds
    pxPerSecond = (startY - endY) / BASE_DURATION;
    track.style.transform = `translateY(${currentY}px)`;
    lastTime = null;
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    if (paused) return;
    paused = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resume() {
    if (!paused) return;
    paused = false;
    lastTime = null; // reset so we don't get a huge delta jump
    rafId = requestAnimationFrame(tick);
  }

  function togglePause() {
    paused ? resume() : pause();
    return paused;
  }

  function slower() {
    // Reduce speed to 70% — same relative step as before
    pxPerSecond = Math.max(
      pxPerSecond * 0.7,
      (startY - endY) / (BASE_DURATION * 3),
    );
  }

  function faster() {
    // Increase speed by ~43% — same relative step as before
    pxPerSecond = Math.min(
      pxPerSecond * 1.4,
      (startY - endY) / (BASE_DURATION * 0.25),
    );
  }

  function init() {
    track = document.getElementById("crawlTrack");
  }

  return { init, start, togglePause, slower, faster };
})();

/* ──────────────────────────────────────────────────
   MODULE: ControlsBar
   Handles button interactions and delegates to
   CreditsCrawl. Also manages the visibility
   transition so controls fade in with the crawl.
────────────────────────────────────────────────── */
const ControlsBar = (() => {
  function init(crawl, introDelay) {
    const controlsEl = document.getElementById("controls");
    const btnPause = document.getElementById("btnPause");
    const btnSlow = document.getElementById("btnSlow");
    const btnFast = document.getElementById("btnFast");

    /* Show the controls bar after the intro card has faded */
    setTimeout(() => controlsEl.classList.add("visible"), introDelay);

    /* Pause / Resume toggle */
    btnPause.addEventListener("click", () => {
      const nowPaused = crawl.togglePause();
      btnPause.textContent = nowPaused ? "RESUME" : "PAUSE";
    });

    /* Speed buttons just call through to the crawl module */
    btnSlow.addEventListener("click", () => crawl.slower());
    btnFast.addEventListener("click", () => crawl.faster());

    /* Keyboard shortcuts for accessibility + power users */
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        btnPause.click();
      }
      if (e.key === "ArrowUp") crawl.faster();
      if (e.key === "ArrowDown") crawl.slower();
    });
  }

  return { init };
})();

function backToTitle() {
  window.location.href = "../titleScreen/title.html";
}

/* BOOT SEQUENCE
   Runs after the DOM is fully parsed. Initialises
   each module in dependency order, then waits for
   the intro card animation to complete before
   starting the crawl. */

document.addEventListener("DOMContentLoaded", () => {
  // How long the intro title card takes before we start the crawl (ms).
  // This should roughly match the animation duration in the CSS.
  const INTRO_DURATION_MS = 5000;

  // Kick off the star field immediately — it renders behind the intro card
  StarField.init();

  // Prepare the crawl module (binds to the DOM element)
  CreditsCrawl.init();

  // Wire up buttons and keyboard shortcuts
  ControlsBar.init(CreditsCrawl, INTRO_DURATION_MS);

  // Start the crawl after the intro card has faded away
  setTimeout(() => {
    CreditsCrawl.start();
  }, INTRO_DURATION_MS);
});

/*Code for sounds if button clicked */
if (localStorage.getItem("playButtonSound") === "true") {
  const sound = new Audio("../../Sounds/buttonPress.mp3");
  sound.volume = 0.5;
  sound.play().catch(() => {});
  localStorage.removeItem("playButtonSound");
}
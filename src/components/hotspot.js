class Hotspot {
  /**
   * Two positioning modes are supported:
   *   • grid (default): integer x/y/width/height in 24x18 grid units, rendered
   *     via CSS grid-area. A general capability (no current consumer).
   *   • absolute: CSS-length `left`/`top` (and width/height) for placing a
   *     hotspot over a background image, centred on the point. Used by the
   *     level player, which stores %/px coordinates in level.json.
   *
   * @param {object} spec
   * @param {string} spec.id      - unique identifier
   * @param {number} [spec.x]     - left column (grid mode, 0-based grid unit)
   * @param {number} [spec.y]     - top row (grid mode, 0-based grid unit)
   * @param {string} [spec.left]  - CSS left (absolute mode, e.g. "42%")
   * @param {string} [spec.top]   - CSS top (absolute mode, e.g. "44%")
   * @param {number|string} spec.width  - grid columns (grid) or CSS length (absolute)
   * @param {number|string} spec.height - grid rows (grid) or CSS length (absolute)
   * @param {string} spec.label   - human-readable object name
   * @param {string} spec.command - command the player types to inspect it
   */
  constructor({ id, x, y, width, height, left, top, label, command }) {
    if (!id) {
      throw new Error("Hotspot requires an id");
    }

    this.id = id;
    this.width = width;
    this.height = height;
    this.label = label;
    this.command = command;
    this.active = false; // whether the tooltip is held open by a tap/click
    this.element = null;
    this.onSelect = null;

    if (typeof left === "string" || typeof top === "string") {
      this.mode = "absolute";
      this.left = left;
      this.top = top;
    } else {
      this.mode = "grid";
      if (![x, y, width, height].every(Number.isInteger)) {
        throw new Error(`Hotspot "${id}" needs integer x, y, width, height`);
      }
      if (width <= 0 || height <= 0) {
        throw new Error(`Hotspot "${id}" needs positive width and height`);
      }
      this.x = x;
      this.y = y;
    }
  }

  /**
   * CSS grid-area value: row-start / col-start / row-end / col-end.
   * Grid lines are 1-based while our coordinates are 0-based, so add 1.
   */
  get gridArea() {
    const rowStart = this.y + 1;
    const colStart = this.x + 1;
    const rowEnd = this.y + this.height + 1;
    const colEnd = this.x + this.width + 1;
    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`;
  }

  /** Description read aloud by screen readers. */
  get ariaLabel() {
    return `${this.label}. Type ${this.command} to inspect.`;
  }

  /**
   * Open the tooltip and keep it held open (for touch/click, where there is
   * no hover). Reflects state via the `active` class and aria-expanded.
   */
  activate() {
    this.active = true;
    if (this.element) {
      this.element.classList.add("active");
      this.element.setAttribute("aria-expanded", "true");
    }
    return this;
  }

  /** Close a held-open tooltip. */
  deactivate() {
    this.active = false;
    if (this.element) {
      this.element.classList.remove("active");
      this.element.setAttribute("aria-expanded", "false");
    }
    return this;
  }

  /** Toggle the held-open tooltip — what a tap/click does by default. */
  toggle() {
    return this.active ? this.deactivate() : this.activate();
  }

  /** Update the command shown in the tooltip (the level player swaps this per
   *  phase, so the hotspot always shows the command the current step expects). */
  setCommand(command) {
    this.command = command;
    if (this.element) {
      const commandEl = this.element.querySelector(".command");
      if (commandEl) {
        commandEl.textContent = command || "";
      }
      this.element.setAttribute("aria-label", this.ariaLabel);
    }
    return this;
  }

  /** Apply this hotspot's position to its element, per its mode. */
  applyPosition(element) {
    if (this.mode === "absolute") {
      element.style.position = "absolute";
      element.style.left = this.left;
      element.style.top = this.top;
      if (this.width != null) {
        element.style.width =
          typeof this.width === "number" ? `${this.width}px` : this.width;
      }
      if (this.height != null) {
        element.style.height =
          typeof this.height === "number" ? `${this.height}px` : this.height;
      }
      element.style.transform = "translate(-50%, -50%)";
    } else {
      element.style.gridArea = this.gridArea;
    }
  }

  /**
   * Build the hotspot's DOM element and wire up its click handler.
   * @param {Document} doc - injectable for testing; defaults to global document.
   * @returns {Element} the hotspot element (also stored on this.element).
   */
  render(doc = typeof document !== "undefined" ? document : null) {
    if (!doc) {
      throw new Error("Hotspot.render() requires a DOM document");
    }

    const element = doc.createElement("div");
    element.className = "hotspot";
    element.tabIndex = 0; // keyboard-focusable so the tooltip works without a mouse
    element.dataset.id = this.id;
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", this.ariaLabel);
    element.setAttribute("aria-expanded", "false");
    this.applyPosition(element);

    const tooltip = doc.createElement("div");
    tooltip.className = "tooltip";

    const labelSpan = doc.createElement("span");
    labelSpan.className = "label";
    labelSpan.textContent = this.label;

    const commandSpan = doc.createElement("span");
    commandSpan.className = "command";
    commandSpan.textContent = this.command;

    tooltip.append(labelSpan, commandSpan);
    element.append(tooltip);

    // Click/tap reveals the tooltip — the only way touch users (no hover)
    // can see the command. A host may set onSelect to coordinate siblings.
    element.addEventListener("click", () => {
      if (typeof this.onSelect === "function") {
        this.onSelect(this);
      } else {
        this.toggle();
      }
    });
    // Keyboard activation (Enter/Space) for the role="button" element.
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });

    this.element = element;
    return element;
  }
}

// Dual export: CommonJS for Jest, global binding for classic <script> use.
if (typeof module !== "undefined" && module.exports) {
  module.exports = Hotspot;
}

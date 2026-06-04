/**
 * Hotspot — an interactive object in the game viewport.
 *
 * The viewport is the 24x18 region (cols 0-24, rows 0-18) of the full
 * 34x20 game grid. A hotspot occupies a rectangle of grid cells and, on
 * hover/focus (desktop) or tap/click (touch), shows the OOP command the
 * player must type to inspect it.
 *
 */
class Hotspot {
  /**
   * @param {object} spec
   * @param {string} spec.id      - unique identifier
   * @param {number} spec.x       - left column (0-based grid unit)
   * @param {number} spec.y       - top row (0-based grid unit)
   * @param {number} spec.width   - width in grid columns
   * @param {number} spec.height  - height in grid rows
   * @param {string} spec.label   - human-readable object name
   * @param {string} spec.command - command the player types to inspect it
   */
  constructor({ id, x, y, width, height, label, command }) {
    if (!id) {
      throw new Error("Hotspot requires an id");
    }
    if (![x, y, width, height].every(Number.isInteger)) {
      throw new Error(`Hotspot "${id}" needs integer x, y, width, height`);
    }
    if (width <= 0 || height <= 0) {
      throw new Error(`Hotspot "${id}" needs positive width and height`);
    }

    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.command = command;
    this.active = false; // whether the tooltip is held open by a tap/click
    this.element = null;
    this.onSelect = null;
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

  /**
   * Build the hotspot's DOM element and wire up its click handler.
   * @param {Document} doc - injectable for testing; defaults to global document.
   * @returns {Element} the hotspot element (also stored on this.element).
   */
  render(doc = typeof document !== "undefined" ? document : null) {
    if (!doc) {
      throw new Error("Hotspot.render() requires a DOM document");
    }

    const el = doc.createElement("div");
    el.className = "hotspot";
    el.tabIndex = 0; // keyboard-focusable so the tooltip works without a mouse
    el.dataset.id = this.id;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", this.ariaLabel);
    el.setAttribute("aria-expanded", "false");
    el.style.gridArea = this.gridArea;

    const tip = doc.createElement("div");
    tip.className = "tooltip";

    const labelEl = doc.createElement("span");
    labelEl.className = "label";
    labelEl.textContent = this.label;

    const commandEl = doc.createElement("span");
    commandEl.className = "command";
    commandEl.textContent = this.command;

    tip.append(labelEl, commandEl);
    el.append(tip);

    // Click/tap reveals the tooltip — the only way touch users (no hover)
    // can see the command. A host may set onSelect to coordinate siblings.
    el.addEventListener("click", () => {
      if (typeof this.onSelect === "function") {
        this.onSelect(this);
      } else {
        this.toggle();
      }
    });
    // Keyboard activation (Enter/Space) for the role="button" element.
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        el.click();
      }
    });

    this.element = el;
    return el;
  }
}

// Dual export: CommonJS for Jest, global binding for classic <script> use.
if (typeof module !== "undefined" && module.exports) {
  module.exports = Hotspot;
}

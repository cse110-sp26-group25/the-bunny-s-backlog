/**
 * Interactable — a simple clickable item in the game viewport.
 *   1. `action` names what should happen (e.g. 'changeBackground').
 *   2. `Interactable.actions[name]` holds the handler that performs it.
 *   3. A host may instead set `onActivate(interactable)` for one-off behavior.
 *
 * If nothing is wired up, activate() is a safe no-op (with a console warning),
 * so unfinished interactables never throw.
 *
 */
class Interactable {
  /**
   * @param {object} spec
   * @param {string} spec.id      - unique identifier
   * @param {number} spec.x       - left column (0-based grid unit)
   * @param {number} spec.y       - top row (0-based grid unit)
   * @param {number} spec.width   - width in grid columns
   * @param {number} spec.height  - height in grid rows
   * @param {string} [spec.label] - human-readable name (for the aria label)
   * @param {string} [spec.action] - key into Interactable.actions (what happens)
   * @param {object} [spec.payload] - arbitrary data passed to the action handler
   */
  constructor({
    id,
    x,
    y,
    width,
    height,
    label = "",
    action = null,
    payload = null,
  }) {
    if (!id) {
      throw new Error("Interactable requires an id");
    }
    if (![x, y, width, height].every(Number.isInteger)) {
      throw new Error(`Interactable "${id}" needs integer x, y, width, height`);
    }
    if (width <= 0 || height <= 0) {
      throw new Error(`Interactable "${id}" needs positive width and height`);
    }

    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.action = action; // name of the effect to run (TBD which effects exist)
    this.payload = payload; // opaque data the handler may use (e.g. a color/url)
    this.element = null;
    // Optional per-instance override: (interactable, doc) => {}. Takes priority
    // over the named-action registry, for behavior a host wires up directly.
    this.onActivate = null;
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
    return this.label || `Interactable ${this.id}`;
  }

  /**
   * Run the interactable's effect. Resolution order:
   *   1. an instance `onActivate` override, else
   *   2. the named handler in `Interactable.actions[this.action]`, else
   *   3. a no-op (warns once so unwired items are easy to spot).
   * @param {Document} [doc] - passed through to handlers that touch the DOM.
   * @returns {Interactable} this, for chaining.
   */
  activate(doc = typeof document !== "undefined" ? document : null) {
    if (typeof this.onActivate === "function") {
      this.onActivate(this, doc);
      return this;
    }

    const handler = this.action && Interactable.actions[this.action];
    if (typeof handler === "function") {
      handler(this, doc);
      return this;
    }

    // Boilerplate path: the effect isn't decided/wired yet.
    if (typeof console !== "undefined") {
      console.warn(
        `Interactable "${this.id}": no action wired for "${this.action}"`,
      );
    }
    return this;
  }

  /**
   * Build the interactable's DOM element and wire up its click handler.
   * @param {Document} doc - injectable for testing; defaults to global document.
   * @returns {Element} the element (also stored on this.element).
   */
  render(doc = typeof document !== "undefined" ? document : null) {
    if (!doc) {
      throw new Error("Interactable.render() requires a DOM document");
    }

    const el = doc.createElement("div");
    el.className = "interactable";
    el.tabIndex = 0; // keyboard-focusable
    el.dataset.id = this.id;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", this.ariaLabel);
    el.style.gridArea = this.gridArea;

    el.addEventListener("click", () => this.activate(doc));
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

/**
 * Registry of named effects. A host fills these in as the design firms up;
 * keys referenced by an interactable's `action` are looked up here.
 *
 * Example stub for the likely "background change" effect — implement when the
 * behavior is confirmed:
 *
 *   Interactable.actions.changeBackground = (interactable, doc) => {
 *     const viewport = doc.getElementById('viewport');
 *     if (viewport && interactable.payload) {
 *       viewport.style.background = interactable.payload.background;
 *     }
 *   };
 */
Interactable.actions = {};

// Dual export: CommonJS for Jest, global binding for classic <script> use.
if (typeof module !== "undefined" && module.exports) {
  module.exports = Interactable;
}

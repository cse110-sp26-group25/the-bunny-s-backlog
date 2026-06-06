/**
 * It renders the scene, dialogue, HUD, inventory, notebook/lessons, terminal, toasts,
 * and win overlay, and wires up the page's event listeners. {@link LevelPlayer} calls
 * these methods implemented here to reflect game state on screen.
 */
class LevelUI {
  /**
   * Sets up the UI with no hotspots and no current background.
   */
  constructor() {
    this.hotspots = [];
    this.currentBackgroundUrl = null;
  }

  /**
   * Shorthand for document.getElementById.
   *
   * @param {string} elementId
   * @returns {?HTMLElement}
   */
  byId(elementId) {
    return document.getElementById(elementId);
  }

  /**
   * Escapes HTML-significant characters so untrusted text can be safely
   * interpolated into innerHTML.
   *
   * @param {*} text
   * @returns {string}
   */
  escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Sets the browser tab / document title.
   *
   * @param {string} title
   */
  setTitle(title) {
    document.title = title;
  }

  /**
   * Writes the level's total phase count into the HUD.
   *
   * @param {number} total
   */
  setPhaseTotal(total) {
    const element = this.byId("ph-total");
    if (element) {
      element.textContent = total;
    }
  }

  /**
   * Moves keyboard focus to the terminal input.
   */
  focusInput() {
    this.byId("term-in").focus();
  }

  /**
   * Replaces the terminal input's contents and focuses it, used by click-to-fill
   * hints and hotspots.
   *
   * @param {string} value
   */
  fillInput(value) {
    this.byId("term-in").value = value;
    this.focusInput();
  }

  /**
   * Rebuilds the clickable scene hotspots, wiring each to the
   * given select handler and seeding it with the current command.
   *
   * @param {object[]} specs
   * @param {string} command
   * @param {Function} onSelect
   */
  renderHotspots(specs, command, onSelect) {
    const viewport = this.byId("scene-vp");
    Array.prototype.slice
      .call(viewport.querySelectorAll(".hotspot"))
      .forEach((element) => element.remove());

    this.hotspots = (specs || []).map((spec) => {
      const hotspot = new Hotspot({
        id: spec.id,
        left: spec.x,
        top: spec.y,
        width: spec.w,
        height: spec.h,
        label: spec.label || spec.id,
        command: command,
      });
      hotspot.onSelect = onSelect;
      viewport.insertBefore(hotspot.render(document), this.byId("hud"));
      return hotspot;
    });
  }

  /**
   * Updates every hotspot's command and toggles the "active" highlight on the
   * one matching highlightId.
   *
   * @param {string} command
   * @param {?string} highlightId
   */
  updateHotspots(command, highlightId) {
    this.hotspots.forEach((hotspot) => {
      hotspot.setCommand(command);
      if (hotspot.element) {
        hotspot.element.classList.toggle(
          "active",
          Boolean(highlightId) && hotspot.id === highlightId,
        );
      }
    });
  }

  /**
   * Cross-fades the scene background to a new image, skipping the work if that
   * image is already showing.
   *
   * @param {string} backgroundUrl
   */
  setScene(backgroundUrl) {
    if (!backgroundUrl || backgroundUrl === this.currentBackgroundUrl) {
      return;
    }
    const backgroundEl = this.byId("scene-bg");
    backgroundEl.classList.add("fading");
    setTimeout(() => {
      backgroundEl.style.backgroundImage = 'url("' + backgroundUrl + '")';
      backgroundEl.classList.remove("fading");
    }, 300);
    this.currentBackgroundUrl = backgroundUrl;
  }

  /**
   * Forgets the current background so the next setScene always repaints, used on
   * reset and restore.
   */
  resetScene() {
    this.currentBackgroundUrl = null;
  }

  /**
   * Activates the named sidebar tab and its panel, keeping the ARIA selected
   * state in sync.
   *
   * @param {string} tabName
   */
  switchTab(tabName) {
    document.querySelectorAll(".sbt").forEach((tab) => {
      const selected = tab.dataset.tab === tabName;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
    document.querySelectorAll(".sbp").forEach((panel) => {
      panel.classList.toggle("active", panel.id === "panel-" + tabName);
    });
  }

  /**
   * Renders the dialogue card — avatar, speaker/phase header, text, and an
   * optional click-to-fill hint. All interpolated text is HTML-escaped.
   *
   * @param {{text:string, hint:string}} dialogue
   * @param {string} speaker
   * @param {string} avatar
   * @param {(number|string)} phaseLabel
   */
  renderDialogue(dialogue, speaker, avatar, phaseLabel) {
    const hintHtml = dialogue.hint
      ? '<div class="dlg-hint" data-cmd="' +
        this.escapeHtml(dialogue.hint) +
        '">' +
        this.escapeHtml(dialogue.hint) +
        '<span class="dlg-hlbl">click to fill</span></div>'
      : "";
    this.byId("dlg-panel").innerHTML =
      '<div class="dlg-card"><div class="dlg-row"><div class="dlg-av">' +
      this.escapeHtml(avatar || "🐰") +
      '</div><div><div class="dlg-spk">' +
      this.escapeHtml(speaker || "Guide") +
      " — Phase " +
      phaseLabel +
      '</div><div class="dlg-txt">' +
      this.escapeHtml(dialogue.text) +
      "</div></div></div>" +
      hintHtml +
      "</div>";
  }

  /**
   * Resets the notes and lessons panels to their empty-state placeholders.
   */
  resetPanels() {
    this.byId("notes-list").innerHTML =
      '<li class="empty">No notes yet.<br>Start investigating!</li>';
    this.byId("lessons-list").innerHTML =
      '<li class="empty">No lessons unlocked yet.</li>';
  }

  /**
   * Appends notebook entries, clearing the empty-state placeholder on the first
   * add. No-op for an empty list.
   *
   * @param {string[]} noteLines
   */
  addNotes(noteLines) {
    if (!noteLines || !noteLines.length) {
      return;
    }
    const notesList = this.byId("notes-list");
    if (notesList.querySelector(".empty")) {
      notesList.innerHTML = "";
    }
    noteLines.forEach((line) => {
      const entry = document.createElement("li");
      entry.className = "nb-entry";
      entry.innerHTML = '<div class="nb-val">' + line + "</div>";
      notesList.appendChild(entry);
    });
  }

  /**
   * Appends a lesson card (title + body), clearing the empty-state placeholder on
   * the first add. No-op when lesson is null or raw text string.
   *
   * @param {?({title:string, body:string}|string)} lesson
   */
  addLesson(lesson) {
    if (!lesson) {
      return;
    }
    const lessonsList = this.byId("lessons-list");
    if (lessonsList.querySelector(".empty")) {
      lessonsList.innerHTML = "";
    }
    const card = document.createElement("li");
    card.className = "lc";

    if (typeof lesson === "string") {
      card.innerHTML =
        '<div class="lc-ttl">Lesson learned</div><div class="lc-body">' +
        lesson +
        "</div>";
    } else {
      card.innerHTML =
        '<div class="lc-ttl">' +
        (lesson.title || "Lesson learned") +
        '</div><div class="lc-body">' +
        (lesson.body || JSON.stringify(lesson)) +
        "</div>";
    }
    lessonsList.appendChild(card);
  }

  /**
   * Updates the HUD: the phase badge and the words/clues progress counters.
   *
   * @param {{found:number, total:number}} words
   * @param {{found:number, total:number}} clues
   * @param {(number|string)} phase
   */
  setHud(words, clues, phase) {
    const phaseBadge = this.byId("ph-num");
    if (phaseBadge) {
      phaseBadge.textContent = phase;
    }
    this.byId("ts-words").textContent = words.found + "/" + words.total;
    this.byId("ts-clues").textContent = clues.found + "/" + clues.total;
  }

  /**
   * Empties the inventory bar.
   */
  clearInventory() {
    this.byId("inv-bar").innerHTML = "";
  }

  /**
   * Appends a labelled chip to the inventory bar.
   *
   * @param {string} label
   */
  addInventoryChip(label) {
    const chip = document.createElement("li");
    chip.className = "inv-chip";
    chip.textContent = label;
    this.byId("inv-bar").appendChild(chip);
  }

  /**
   * Appends a styled line to the terminal log, scrolls to the bottom, and shows
   * the log.
   *
   * @param {string} text
   * @param {string} cssClass
   */
  appendTerminalLine(text, cssClass) {
    const line = document.createElement("div");
    line.className = "tl " + cssClass;
    line.textContent = text;
    this.byId("tlog-scroll").appendChild(line);
    this.byId("tlog-scroll").scrollTop = 99999;
    this.byId("tlog-wrap").classList.add("show");
  }

  /**
   * Empties the terminal log and hides it.
   */
  clearTerminal() {
    this.byId("tlog-scroll").innerHTML = "";
    this.byId("tlog-wrap").classList.remove("show");
  }

  /**
   * Repaints the terminal from a saved history array, then leaves the log hidden.
   *
   * @param {Array<{text:string, cls:string}>} history
   */
  renderTerminalHistory(history) {
    this.byId("tlog-scroll").innerHTML = "";
    (history || []).forEach((line) =>
      this.appendTerminalLine(line.text, line.cls),
    );
    this.byId("tlog-wrap").classList.remove("show");
  }

  /**
   * Hides the terminal log overlay and returns focus to the input.
   */
  hideTerminalLog() {
    this.byId("tlog-wrap").classList.remove("show");
    this.focusInput();
  }

  /**
   * Shows a transient toast message that auto-dismisses after a few seconds.
   *
   * @param {string} message
   */
  showToast(message) {
    const toast = this.byId("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  /**
   * Scatters a short burst of celebratory emoji sparks across the screen.
   *
   * @param {string} emoji
   */
  spawnSparks(emoji) {
    for (let index = 0; index < 5; index++) {
      setTimeout(() => {
        const spark = document.createElement("div");
        spark.className = "spark";
        spark.textContent = emoji;
        spark.style.left = 12 + Math.random() * 76 + "vw";
        spark.style.top = 12 + Math.random() * 58 + "vh";
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1200);
      }, index * 65);
    }
  }

  /**
   * Fills in the win overlay's text content (emojis, titles, button labels) from
   * the level's win config. Does not reveal the overlay.
   *
   * @param {object} win
   */
  renderWinOverlay(win) {
    this.byId("win-emojis").textContent = win.emojis || "🎉";
    this.byId("win-title").textContent = win.title || "Level Complete!";
    this.byId("win-subtitle").textContent = win.subtitle || "";
    this.byId("win-message").textContent = win.message || "";
    this.byId("win-footnote").textContent = win.footnote || "";
    this.byId("win-restart").textContent = win.replayLabel || "↺ Play Again";
    this.byId("proceed-btn").textContent = win.nextToast || win.nextLabel || "▶ Continue";
  }

  /**
   * Reveals the win overlay and continue button, optionally after a delay.
   *
   * @param {number} [delayMs]
   */
  showWinOverlay(delayMs) {
    const reveal = () => {
      this.byId("proceed-btn").classList.add("show");
      this.byId("win-bg").classList.add("show");
    };
    if (delayMs) {
      setTimeout(reveal, delayMs);
    } else {
      reveal();
    }
  }

  /**
   * Hides the win overlay and continue button.
   */
  hideWinOverlay() {
    this.byId("win-bg").classList.remove("show");
    this.byId("proceed-btn").classList.remove("show");
  }

  /**
   * Replaces the whole page with a fatal-error screen when the level can't start.
   *
   * @param {string} message
   */
  showFatal(message) {
    document.body.innerHTML =
      '<div style="max-width:40rem;margin:4rem auto;padding:1.5rem;' +
      'font-family:system-ui,sans-serif;color:#a86030;text-align:center">' +
      "<h1>Could not start the level</h1><p>" +
      this.escapeHtml(message) +
      "</p><p>Make sure the game is served over http:// (run <code>npm start</code>).</p></div>";
  }

  /**
   * Wires up all the page's event listeners — terminal submit, hint click-to-fill,
   * tab switching, focus/escape handling, scene click-to-focus, and the
   * close/reset/restart/proceed buttons — delegating game actions to the handlers.
   *
   * @param {{onSubmit:Function, onReset:Function, onProceed:Function}} handlers
   */
  bindEvents(handlers) {
    const terminalInput = this.byId("term-in");

    terminalInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }
      const rawInput = terminalInput.value.trim();
      terminalInput.value = "";
      handlers.onSubmit(rawInput);
    });

    this.byId("dlg-panel").addEventListener("click", (event) => {
      const hintEl = event.target.closest(".dlg-hint");
      if (hintEl) {
        this.fillInput(hintEl.dataset.cmd || "");
      }
    });

    document.querySelectorAll(".sbt").forEach((tabButton) => {
      tabButton.addEventListener("click", () =>
        this.switchTab(tabButton.dataset.tab),
      );
    });

    terminalInput.addEventListener("focus", () => {
      this.byId("tlog-wrap").classList.remove("show");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.byId("tlog-wrap").classList.remove("show");
        this.byId("win-bg").classList.remove("show");
        terminalInput.focus();
      }
    });

    this.byId("scene-vp").addEventListener("click", (event) => {
      if (
        event.target.closest("#tlog-wrap") ||
        event.target.closest(".hotspot")
      ) {
        return;
      }
      terminalInput.focus();
    });

    this.byId("tlog-x").addEventListener("click", () => this.hideTerminalLog());
    this.byId("ts-rst").addEventListener("click", () => handlers.onReset());
    this.byId("win-restart").addEventListener("click", () =>
      handlers.onReset(),
    );
    this.byId("proceed-btn").addEventListener("click", () =>
      handlers.onProceed(),
    );
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelUI };
}
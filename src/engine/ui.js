/* global Hotspot */

class LevelUI {
  constructor() {
    this.hotspots = [];
    this.currentBackgroundUrl = null;
  }

  byId(elementId) {
    return document.getElementById(elementId);
  }

  escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  setTitle(title) {
    document.title = title;
  }

  setPhaseTotal(total) {
    const element = this.byId("ph-total");
    if (element) {
      element.textContent = total;
    }
  }

  focusInput() {
    this.byId("term-in").focus();
  }

  fillInput(value) {
    this.byId("term-in").value = value;
    this.focusInput();
  }

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

  resetScene() {
    this.currentBackgroundUrl = null;
  }

  switchTab(tabName) {
    document.querySelectorAll(".sbt").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    document.querySelectorAll(".sbp").forEach((panel) => {
      panel.classList.toggle("active", panel.id === "panel-" + tabName);
    });
  }

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
      this.escapeHtml(avatar) +
      '</div><div><div class="dlg-spk">' +
      this.escapeHtml(speaker) +
      " — Phase " +
      phaseLabel +
      '</div><div class="dlg-txt">' +
      this.escapeHtml(dialogue.text) +
      "</div></div></div>" +
      hintHtml +
      "</div>";
  }

  resetPanels() {
    this.byId("notes-list").innerHTML =
      '<div class="empty">No notes yet.<br>Start investigating!</div>';
    this.byId("lessons-list").innerHTML =
      '<div class="empty">No lessons unlocked yet.</div>';
  }

  addNotes(noteLines) {
    if (!noteLines || !noteLines.length) {
      return;
    }
    const notesList = this.byId("notes-list");
    if (notesList.querySelector(".empty")) {
      notesList.innerHTML = "";
    }
    noteLines.forEach((line) => {
      const entry = document.createElement("div");
      entry.className = "nb-entry";
      entry.innerHTML = '<div class="nb-val">' + line + "</div>";
      notesList.appendChild(entry);
    });
  }

  addLesson(lesson) {
    if (!lesson) {
      return;
    }
    const lessonsList = this.byId("lessons-list");
    if (lessonsList.querySelector(".empty")) {
      lessonsList.innerHTML = "";
    }
    const card = document.createElement("div");
    card.className = "lc";
    card.innerHTML =
      '<div class="lc-ttl">' +
      lesson.title +
      '</div><div class="lc-body">' +
      lesson.body +
      "</div>";
    lessonsList.appendChild(card);
  }

  setHud(words, clues, phase) {
    const phaseBadge = this.byId("ph-num");
    if (phaseBadge) {
      phaseBadge.textContent = phase;
    }
    this.byId("ts-words").textContent = words.found + "/" + words.total;
    this.byId("ts-clues").textContent = clues.found + "/" + clues.total;
  }

  clearInventory() {
    this.byId("inv-bar").innerHTML = "";
  }

  addInventoryChip(label) {
    const chip = document.createElement("div");
    chip.className = "inv-chip";
    chip.textContent = label;
    this.byId("inv-bar").appendChild(chip);
  }

  appendTerminalLine(text, cssClass) {
    const line = document.createElement("div");
    line.className = "tl " + cssClass;
    line.textContent = text;
    this.byId("tlog-scroll").appendChild(line);
    this.byId("tlog-scroll").scrollTop = 99999;
    this.byId("tlog-wrap").classList.add("show");
  }

  clearTerminal() {
    this.byId("tlog-scroll").innerHTML = "";
    this.byId("tlog-wrap").classList.remove("show");
  }

  renderTerminalHistory(history) {
    this.byId("tlog-scroll").innerHTML = "";
    (history || []).forEach((line) => this.appendTerminalLine(line.text, line.cls));
    this.byId("tlog-wrap").classList.remove("show");
  }

  hideTerminalLog() {
    this.byId("tlog-wrap").classList.remove("show");
    this.focusInput();
  }

  showToast(message) {
    const toast = this.byId("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

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

  renderWinOverlay(win) {
    this.byId("win-emojis").textContent = win.emojis || "🎉";
    this.byId("win-title").textContent = win.title || "Level Complete!";
    this.byId("win-subtitle").textContent = win.subtitle || "";
    this.byId("win-message").textContent = win.message || "";
    this.byId("win-footnote").textContent = win.footnote || "";
    this.byId("win-restart").textContent = win.replayLabel || "↺ Play Again";
    this.byId("proceed-btn").textContent = win.nextLabel || "▶ Continue";
  }

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

  hideWinOverlay() {
    this.byId("win-bg").classList.remove("show");
    this.byId("proceed-btn").classList.remove("show");
  }

  showFatal(message) {
    document.body.innerHTML =
      '<div style="max-width:40rem;margin:4rem auto;padding:1.5rem;' +
      'font-family:system-ui,sans-serif;color:#a86030;text-align:center">' +
      "<h1>Could not start the level</h1><p>" +
      this.escapeHtml(message) +
      "</p><p>Make sure the game is served over http:// (run <code>npm start</code>).</p></div>";
  }

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
      tabButton.addEventListener("click", () => this.switchTab(tabButton.dataset.tab));
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
      if (event.target.closest("#tlog-wrap") || event.target.closest(".hotspot")) {
        return;
      }
      terminalInput.focus();
    });

    this.byId("tlog-x").addEventListener("click", () => this.hideTerminalLog());
    this.byId("ts-rst").addEventListener("click", () => handlers.onReset());
    this.byId("win-restart").addEventListener("click", () => handlers.onReset());
    this.byId("proceed-btn").addEventListener("click", () => handlers.onProceed());
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelUI };
}

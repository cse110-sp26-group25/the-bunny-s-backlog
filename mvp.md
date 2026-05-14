# Compile Quest ⚔️⌨️ 

**Project:** Open-World RPG Rogue-like Typing Game  
**Team:** Group 25 (KnowIdeas) | **Course:** CSE 110 Spring 2026

---

## MVP Definition (Minimum Viable Product)
The goal of the MVP is to deliver a functional "Run" where a player can navigate a tile-based map, engage in syntax-driven combat, and manage a basic inventory—all while functioning offline on mobile.

### 1. Core Gameplay & Features
- [ ] **Typing Combat Engine:** A DOM-driven system mirroring syntax-heavy code prompts with real-time validation and visual feedback for hits/typos.
- [ ] **Rogue-like Loop:** Implementation of HP (Health Points), permadeath mechanics, and "Runtime Termination" (Game Over) state.
- [ ] **Inventory Data Model:** Structured JSON-based items/buffs (e.g., Accuracy Shields, WPM Boosters) that influence player attributes.
- [ ] **Open-World Exploration:** Lightweight, tile-based map stored as a 2D array and rendered via CSS Grid/Flexbox for mobile-responsive navigation.
- [ ] **Offline Persistence:** Integration of `LocalStorage` to persist player state, map progress, and inventory data.

### 2. Software Engineering Infrastructure (Sprint 2 Requirements)
- [ ] **ADR Documentation:** Use of **MADR format** to document major technical decisions (e.g., [ADR-001] Vanilla JS vs Frameworks, [ADR-002] LocalStorage Persistence).
- [ ] **System Diagrams:** Workflow diagram (e.g., State Machine for combat) integrated into `docs/design`.
- [ ] **CI/CD Pipeline:** Active **GitHub Actions** for automated linting and unit testing (WPM logic, HP depletion) on every Pull Request.
- [ ] **Mobile-First UX:** UI designed using the **Inverted F Pattern** and optimized input fields to ensure visibility during virtual keyboard engagement.

---

## Technical Workflow (Exit Criteria)

### Typing Combat State Machine
1. **Event Capture:** `keydown` listener intercepts player input.
2. **Validation:** Logic checks input against target syntax string stored in the map data.
3. **State Update:** HP adjusted based on accuracy; WPM calculated in real-time.
4. **UI Render:** DOM updates classes (e.g., `.correct`, `.error`) for immediate visual feedback.

---

## Technical Stack
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Architecture:** Modular "Theory Building" approach—separating Typing Engine, Inventory Manager, and Map Renderer.
* **Version Control:** Semantic Versioning (**SemVer**) and **Conventional Commits** (`feat:`, `fix:`, `docs:`).

---

## Definition of Done (DoD)
An issue/task is considered "Done" only when:
1. Code follows **JSDocs** standards for internal documentation.
2. The logic is covered by **Unit Tests**.
3. A human peer review is completed via **Pull Request** for batches >300 lines.
4. **LLM Attribution:** Any AI-assisted code is documented in `AI-LOG.md` with specific prompts and revisions
5. The **ADR** is updated if a major architectural change was made.

---

## Setup for Developers
1. Clone the repo: `git clone https://github.com/cse110-sp26-group25/compile-quest.git`
2. No build step required—launch `index.html` via Live Server
3. Ensure GitHub Actions pass before merging to `main`

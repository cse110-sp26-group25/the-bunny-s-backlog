# Compile Quest ⚔️⌨️ 
**Project:** Open-World RPG Rogue-like Typing Game  
**Team:** Group 25 (KnowIdeas) | **Course:** CSE 110 Spring 2026

---

## MVP Definition (Minimum Viable Product)
The goal of the MVP is to deliver a functional "Run" where a player can navigate a tile-based map, engage in syntax-driven combat, and manage a basic inventory—all while functioning offline on mobile.

### 1. Core Gameplay & Features
- [ ] **Typing Combat Engine:** A DOM-driven system that mirrors syntax-heavy code prompts with real-time validation (visual feedback for hits/typos).
- [ ] **Rogue-like Loop:** Implementation of HP (Health Points), permadeath mechanics, and "Runtime Termination" (Game Over) state.
- [ ] **Inventory Data Model:** A system to track items/buffs that influence typing stats (e.g., Accuracy Shields, WPM Boosters).
- [ ] **Open-World Exploration:** A lightweight, tile-based map built with CSS Grid/Flexbox for mobile-responsive navigation.
- [ ] **Offline Persistence:** Integration of `LocalStorage` to save player state and inventory without a network connection.

### 2. Software Engineering Infrastructure (Sprint 2 Requirements)
- [ ] **ADR Documentation:** Use of **MADR format** to document major technical decisions (e.g., why Vanilla JS, why LocalStorage).
- [ ] **System Diagrams:** Inclusion of at least one workflow diagram (e.g., State Machine for combat or Data Model for inventory).
- [ ] **CI/CD Pipeline:** Active **GitHub Actions** to automate linting and unit testing (WPM logic, health depletion) on every Pull Request.
- [ ] **Mobile-First UX:** UI designed with the "Inverted F Pattern" and accessible input fields that trigger native mobile keyboards.

---

## Technical Stack
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
*   **Architecture:** Modular "Theory Building" approach—separating the Typing Engine, Inventory Manager, and Map Renderer.
*   **Version Control:** Semantic Versioning (**SemVer**) and **Conventional Commits** (`feat:`, `fix:`, `docs:`).

---

## Definition of Done (DoD)
An issue/task is considered "Done" only when:
1. Code follows **JSDocs** standards for internal documentation.
2. The logic is covered by **Unit Tests**.
3. A human peer review is completed via **Pull Request** (for batches >300 lines).
4. The **ADR** is updated if a major architectural change was made.

---

## Setup for Developers
1. Clone the repo: `git clone https://github.com/cse110-sp26-group25/compile-quest.git`
2. No build step required—launch `index.html` via Live Server.
3. Ensure GitHub Actions pass before merging to `main`.

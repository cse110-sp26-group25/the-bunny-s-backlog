# Compile Quest ⚔️⌨️

**Compile Quest** is a mobile-friendly, offline-first, open-world RPG rogue-like where your keyboard is your greatest weapon. Instead of traditional button-mashing, players navigate a dangerous world and defeat enemies by accurately typing syntax-heavy code snippets.

---

##  Core Gameplay Loop

1. **Explore:** Navigate an open-world map built with Vanilla JavaScript and DOM-driven rendering.
2. **Combat:** Engage obstacles by mirroring dynamic code prompts. Speed and accuracy determine your damage output.
3. **Loot:** Collect items to upgrade your "Inventory," modifying your typing stats (e.g., accuracy shields or WPM boosters).
4. **Permadeath:** If your HP hits zero, the "Runtime" terminates, and you must start a new run.

---

## Technical Stack

*   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
*   **Architecture:** Modular design with a focus on clean state management and Inventory Data Architecture.
*   **Persistence:** Offline-first functionality using LocalStorage and PWA principles.
*   **DevOps:** GitHub Actions for CI/CD, automated unit testing for WPM/Accuracy logic.

---

## MVP Features (v0.1.0)

- [ ] **Typing Engine:** Real-time character validation with visual feedback for typos.
- [ ] **Data Architecture:** A robust Inventory system capable of handling item effects and player stats.
- [ ] **Rogue-like Cycle:** Basic game-over state and run-reset logic.
- [ ] **Mobile-Responsive UI:** Optimized input fields that trigger native mobile keyboards.
- [ ] **Offline Mode:** Fully playable without an active internet connection.

---

## Software Engineering Excellence

This project was developed for **CSE 110** with a strict adherence to Agile methodologies:

*   **ADRs (Architectural Decision Records):** Every major technical choice (like choosing Vanilla JS over a framework) is documented.
*   **Quality Assurance:** High test coverage for core game logic.
*   **CI/CD:** Automated pipelines ensure that the "main" branch is always deployable.

---

## Setup & Installation

Since this project is built with Vanilla web technologies, no heavy installation is required.

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/compile-quest.git](https://github.com/cse110-sp26-group25/compile-quest.git)

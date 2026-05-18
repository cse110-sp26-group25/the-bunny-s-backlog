# MVP Specification: Type-Witness
**Team:** Group 25 | KnowIdeas  
**Engine:** ct.js  
**Status:** Sprint 2 (Active Development)

---

## 1. Project Overview
**Type-Witness** is a narrative-driven, investigator puzzle game. Players take on the role of an MIB investigator analyzing "corrupted" information files formatted in HTML. The core gameplay loop involves identifying inconsistencies, gathering clues into a **Word Box**, and using **Typing Mechanics** to reconstruct the truth behind each case.

---

## 2. Core Gameplay Loop
1.  **Investigate:** Use the ct.js viewport to explore a scene and click/tap on interactive Points of Interest (POIs).
2.  **Collect:** Identify names, items, or locations (clues) which are then stored in a persistent **Word Box**.
3.  **Deduce:** Open the "Case File" (The Book) to view a summary of the event with missing blanks.
4.  **Resolve:** Type the correct keywords from the Word Box into the story blanks to solve the level.

---

## 3. Functional Requirements (MVP)

### A. Frontend & UI
* **Dual-Platform Support:** Parallel layout architecture for **Mobile** and **Desktop** browsers.
* **The "Book" UI:** A dedicated overlay interface for solving the overarching narrative.
* **Dynamic Word Box:** A UI component that updates in real-time as clues are discovered.
* **Sensory Feedback:** * **Visual:** Highlighting POIs (Easy/Hard mode toggles).
    * **Audio:** SFX for clue discovery and accuracy verification.

### B. Mechanics & Backend Logic
* **Typing Integration:** * **Debugging Mode:** A specialized typing mechanic used to "unlock" or interact with specific HTML evidence.
    * **Accuracy Checker:** Logic to compare user-typed strings against the `true_story` key in the level data.
* **Scene Management:** A modular system to fetch and load scene-specific data (images, clues, coordinates) via JSON.
* **Event Handling:** Implementation of event checks within ct.js to trigger story progression.

### C. Data & Persistence
* **Save States:** Use of **Local Storage** to save level progress, collected clues, and user preferences.
* **State Recovery:** Ability to reload the game and resume from the last completed level or checkpoint.

---

## 4. MVP Content Scope
* **Tutorial Level:** Introduces the "investigate parrot" mechanic and Word Box usage.
* **The Genesis Arc (Case File 001): 2–3 levels following a primary overarching mystery (Subject, Method, Motive).
* **Core Systems:** Fully functional title screen, level selection, and success/failure screens.

---

## 5. Technical Stack
* **Game Engine:** ct.js (v4.x+)
* **Development:** JavaScript / HTML5
* **Data Structure:** JSON-based level configurations.
* **CI/CD:** GitHub Actions for automated deployment to GitHub Pages.

---

## 6. Out of Scope (Post-MVP)
* **Currency/Skin System:** Character customization and random-chance rewards.
* **Hint System:** Automated POI glows and difficulty assistance.
* **Cloud Sync:** Moving from Local Storage to a SQLite-backed cloud database.

---

## 7. Success Criteria
1.  User can find all clues in a level and have them accurately reflected in the Word Box.
2.  The "Accuracy Checker" correctly identifies a solved story and triggers the next level.
3.  The game is fully playable on both an iPhone (Safari) and a desktop browser.

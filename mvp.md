# MVP Specification: The Bunny's Backlog

**Team:** Group 25
**Engine:** ct.js (v4.x+)
**Status:** Sprint 2 (Active Development)

---

## 1. Project Overview

The Bunny's Backlog is a cozy, narrative-driven investigator puzzle game featuring cute animal detectives. The tone strikes a careful balance: a warm, pastel aesthetic that is easy on the eyes, paired with a serious storyline where the mysteries feel genuine. Players take on the role of Bill the Lizard, who must run his friend's detective agency after she suddenly goes missing. 

The absolute core mechanic of the game is its strict **Typing Integration**. Progression is entirely dependent on a terminal side panel where players must manually type out precise Object-Oriented Programming (OOP) syntax commands to interact with the scene, parse syntax rules, and uncover critical clues to solve the case.

---

## 2. Core Gameplay Loop

* **Explore:** Use the ct.js viewport to view the scene and identify interactive physical objects.
* **Learn:** Open Bunny's instructional notebook in the side panel to read syntax rules and understand core programming structures (such as Objects, Scope, and Inheritance).
* **Type (Core Mechanic):** Utilize the terminal input box to type out matching structural code actions (such as `self.search()` or `self.unlock()`) to manipulate the environment.
* **Resolve:** Input commands with zero syntax errors to gather clues, bypass data exceptions, and unlock the final case files.

---

## 3. Functional Requirements (MVP)

### A. Frontend & UI
* **Dual-Platform Support:** Parallel layout architecture optimized for both Mobile and Desktop browsers.
* **The "Notebook" UI:** A persistent side-panel overlay interface displaying instructional coding tips, hints, and log history.
* **Terminal Input Box:** A responsive text entry component mimicking a code editor or terminal for typing commands.
* **Sensory Feedback:** 
  * Visual: Dialogue text boxes, object state changes (such as locked vs. opened drawers), and character asset updates.
  * Audio: SFX for menu interactions, correct command executions, and syntax error alerts.

### B. Mechanics & Backend Logic (Typing Focus)
* **Typing Integration Engine:** A specialized typing framework built within ct.js that functions as the mandatory interface for environment interaction.
* **Syntax Parsing & Accuracy Verification:** Logic that evaluates user-typed strings letter-for-letter against valid target configurations, strictly checking for valid parameters, methods, and trailing semicolons.
* **Scope Validation Engine:** Mechanics that evaluate whether the player's character has the appropriate "Scope" access to successfully interact with or modify an object's state.
* **Error Handling Feedback:** Systems to catch invalid commands or broken object references and output descriptive terminal errors to guide the player's next attempt.
* **Scene Management:** A modular system to fetch and load scene-specific data, character dialogue, interactive object parameters, and hidden clue data via JSON.

### C. Data & Persistence
* **Save States:** Use of Local Storage to save level progress, unlocked notebook pages, and player outfit items.
* **State Recovery:** Ability to reload the application within the browser and resume progress from the latest unlocked case step or tutorial checkpoint.

---

## 4. MVP Content Scope

* **Tutorial Level (Bunny's Office):** A self-contained introductory map where Bill must read Bunny's notes, inspect the desk, search a plant pot to find a hidden key, handle scope errors, and unlock a desk drawer to retrieve Bunny's hidden case journal.
* **Core Systems:** Fully functional title screen, basic level/case selection, text rendering windows, and success/failure terminal feedback states.

---

## 5. Technical Stack

* **Game Engine:** ct.js (v4.x+)
* **Development:** JavaScript / HTML5
* **Data Structure:** JSON-based level and state configurations
* **CI/CD:** GitHub Actions for automated deployment to GitHub Pages

---

## 6. Out of Scope (Post-MVP)

* **Progression Skin System:** Advanced currency accumulation and unlocking extensive cosmetic accessories or clothing outfits for Bill the Lizard.
* **Automated Hint System:** In-game progressive hint toggles or automatic object glowing when players get stuck.
* **Cloud Database Synchronization:** Migrating local browser state persistence to a remote cloud database backend.

---

## 7. Success Criteria

* **Criteria 1:** The primary typing aspect functions perfectly, meaning the command parser accurately identifies valid OOP-styled strings and updates the environment state within ct.js accordingly.
* **Criteria 2:** The accuracy checker handles incorrect typing syntax or scope violations by outputting an appropriate error message without breaking the game loop.
* **Criteria 3:** The complete tutorial loop is fully playable and scale-responsive on both desktop monitors and mobile browsers.

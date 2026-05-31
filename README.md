# The Bunny's Backlog 🐰🦎

[![Deployment Status](https://github.com/cse110-sp26-group25/the-bunny-s-backlog/actions/workflows/deploy.yml/badge.svg)](https://github.com/cse110-sp26-group25/the-bunny-s-backlog/actions)

An investigator puzzle game featuring cute animal detectives, driven entirely by strict Object-Oriented Programming (OOP) typing mechanics. Built for CSE 110 (Spring 2026) by Group 25.

---

## 1. Project Overview & Core Loop
**The Bunny's Backlog** is a cozy, narrative-driven investigator puzzle game with a twist. The tone strikes a careful balance: a warm, pastel aesthetic that is easy on the eyes, paired with a serious storyline where mysteries feel genuine. Players take on the role of Bill the Lizard, who must run his friend's detective agency after she suddenly goes missing.

### The Core Gameplay Loop:
1. **Explore**: Use the layout viewport to view the scene and identify interactive physical objects.
2. **Learn**: Open Bunny's instructional notebook in the side panel to read syntax rules (Objects, Scope, Inheritance).
3. **Type (Core Mechanic)**: Utilize the terminal input box to type out matching structural code actions (such as `self.search()` or `self.unlock()`) to manipulate the environment.
4. **Resolve**: Input commands with zero syntax errors to gather clues, bypass data exceptions, and unlock the final case files.

---

## 2. Technical System Architecture & Layout Calculations
The user interface operates on a strictly responsive, fixed-ratio workspace split into a grid matrix of **34 columns by 20 rows** calculated by relative measurements.

### Screen Partition Specifications
* **Main Game Viewport Canvas**: Occupies columns `0` through `24` and rows `0` through `18` (24x18 grid). Renders the 2D background, interactable animal NPC sprites, and pixel-art static object hotspots.
* **Terminal Typing Area**: Spans columns `0` through `24` and rows `18` through `20` (24x2 grid). Features the interactive command-line entry system and live status trackers (`Words: x/y | Clues: x/y`).
* **Persistent Side Panel (The Notebook)**: Spans columns `24` through `34` and rows `0` through `20` (10x20 grid). Contains three distinct context-switching tabs:
  1. *Bunny's Lessons*: Contextual syntax references and OOP instructional rules.
  2. *Lizard's Notes*: Unlocked object properties and variables acting as the level's source-of-truth log.
  3. *Evidence Case Board*: Drag-and-drop structural logic grid matching `Who`, `Did What`, `Where`, `With What`, and a center `Code Input` validation box.

---

## 3. Functional MVP Engine Requirements

### A. Mechanics & Backend Logic
* **Typing Integration Engine**: Specialized string parsing framework built within ct.js that functions as the mandatory interface for environment interaction.
* **Syntax Parsing & Verification**: Evaluates user-typed strings letter-for-letter against valid configurations. Strictly checks parameters, quotation types, and trailing semicolons.
* **Scope Validation Engine**: Evaluates whether the player's character has the appropriate "Scope" visibility or structural item access to modify an object's state.
* **Error Handling Feedback**: Catches invalid commands or broken object references and outputs custom interpreter errors (`SyntaxError`, `ScopeError`, `TypeError`, `ReferenceError`) to guide the player.
* **Scene Management System**: A modular asset loader to dynamically fetch scene-specific data, dialog streams, hotspot coordinates, and hidden clues via JSON configurations.

### B. Data & Persistence
* **Save States & State Recovery**: Utilizes HTML5 `Local Storage` to track level progression, unlocked notebook pages, and custom wardrobe accessories across browser reloads.

---

## 4. MVP Content Scope & Metrics

### Level 0: The Detective's Office (Tutorial)
* **Concepts Taught**: Terminal execution, basic object methods, string literal arguments.
* **Metrics**: 
  $$\text{Total Words}: 4 \quad | \quad \text{Total Clues}: 1$$
* **Objective**: Hover over the desk, evaluate the `inspect("desk")` command pattern, and execute it flawlessly to clear the tutorial layout.

### Level 1: Bunny Goes Missing & The Plant Pot Puzzle
* **Concepts Taught**: Encapsulated Object Isolation, Method Multi-Parameters, Target References.
* **Metrics**: 
  $$\text{Total Words}: 12 \quad | \quad \text{Total Clues}: 2$$
* **Objective**: Use `self.read("letter");` to intercept hints, track down a physical access token via `self.search("office", "plantpot");`, and pass it to an environmental modifier (`self.unlock("drawer", "desk_key");`) to recover Bunny's Journal.

### Level 2: The Bakery & The Missing Ingredients
* **Concepts Taught**: Public vs. Private Variable Scopes, Object State Auditing, Data Type Compliance.
* **Metrics**: 
  $$\text{Total Words}: 24 \quad | \quad \text{Total Clues}: 4$$
* **Objective**: Audit private properties via `bakery.vault.inspect();`, balance numerical constraints using `bakery.scale.addWeight(20);`, override private system flags using the public setter function `bakery.vault.bypassLock();`, and successfully resolve the Drag-and-Drop Case Notebook.

---

## 5. Technology Stack & Automation
* **Game Engine**: ct.js (v4.x+)
* **Development Foundation**: JavaScript / HTML5 / CSS3 Canvas APIs
* **Data Interchange**: JSON-based level configurations
* **CI/CD Pipeline**: GitHub Actions automated pipeline tracking build status and deploying changes dynamically to GitHub Pages upon merges to `main`.

---

## 6. Project Scope Boundaries (Post-MVP)
* **Progression Skin System**: Advanced currency tracking and cosmetic outfits for Bill the Lizard.
* **Automated Hint System**: Continuous progressive hint toggles or automatic object glowing highlights.
* **Cloud Database Synchronization**: Migrating local browser state persistence away from local storage to a remote cloud database backend.

---

## 7. Setup & Local Development Instructions

### Clone the Repository with Submodules:
```bash
git clone --recursive [https://github.com/cse110-sp26-group25/the-bunny-s-backlog.git](https://github.com/cse110-sp26-group25/the-bunny-s-backlog.git)
cd the-bunny-s-backlog

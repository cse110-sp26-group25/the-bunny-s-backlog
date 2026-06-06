# MVP Specification: The Bunny's Backlog

**Team:** Group 25  
**Engine:** Vanilla JavaScript / HTML5 Canvas (ct.js removed)  
**Status:** Final Sprint (Active Development)

## 1. Project Overview

The Bunny's Backlog is a cozy, narrative-driven investigator puzzle game designed to help users (around 12 years old) familiarize themselves with the syntax of JavaScript. The tone strikes a careful balance: a warm, pastel aesthetic that is soft and easy on the eyes, paired with a serious storyline where the characters feel genuine and the mysteries feel real.

Players take on the role of Bill the Lizard, a deadpan tech-support locksmith who steps into an empty office for routine software updates, only to find that Chief Detective Bunny has suddenly gone missing. Because the town's detective chair is empty and the security console is operational, the community looks to you to run commands and crack their active mysteries.

The absolute core mechanic of the game is its strict Typing Integration. Progression is entirely dependent on a code terminal input box where players must manually type out precise JavaScript syntax commands to interact with the scene, parse syntax rules, change variable scopes, and uncover critical clues using the handwritten journal left behind by Bunny.

## 2. Core Gameplay Loop

### Explore

Use the HTML5 Canvas 2D viewport workspace to view the scene and identify interactive physical objects and environmental hotspots.

### Learn

Slide open Bunny's instructional notebook in the right side panel to read syntax rules and understand core programming structures (such as Variables, Scope, Arrays, Functions, and Try/Catch blocks) explained through relatable metaphors like carrots and snacks.

### Type (Core Mechanic)

Utilize the code terminal input box to type out matching structural code actions (such as `let`, `.push()`, `function`, or `try/catch`) to manipulate the environment.

### Resolve

Input commands with zero syntax errors to gather clues, bypass custom exception logs, update the automated evidence checklist panel, and completely close out the mystery.

## 3. Functional Requirements (MVP)

### A. Frontend & UI

#### Dual-Platform Support

Parallel layout architecture optimized for both Mobile and Desktop browsers operating on a strictly responsive, fixed-ratio workspace split into a grid matrix of 34 columns by 20 rows calculated by relative measurements.

#### The "Notebook" UI

A persistent side-panel overlay interface (spanning columns 24 through 34) displaying instructional coding tips, unlocked object properties via Bunny's Lessons, and an automated Evidence Checklist acting as the level's source-of-truth log.

#### Terminal Input Box

A responsive text entry component mimicking a live code editor (spanning rows 18 through 20) for typing commands. It visually adapts to structural code shifts, such as highlighting open curly braces `{ }` when typing actions inside functions.

#### Sensory Feedback

##### Visual

Dialogue text boxes, object state animations (such as un-shattered vs. shattered bakery counters), character asset updates, and custom template literal evaluation outputs.

##### Audio

SFX for menu interactions, correct command executions, paper-shuffling transitions, and specific audio cues matching individual suspect folders (an owl hoot, a dog bark, and a mouse squeak).

### B. Mechanics & Backend Logic (Typing Focus)

#### Typing Integration Engine

A specialized typing string-parsing framework built directly on native JavaScript Web APIs that functions as the mandatory interface for environment interaction.

#### Syntax Parsing & Accuracy Verification

Logic that evaluates user-typed strings letter-for-letter against valid target configurations, strictly checking for valid parameters, quote marks/backticks for string literals, case sensitivity, and trailing semicolons.

#### Scope Validation Engine

Mechanics that evaluate whether an object variable has been declared using the appropriate scope keyword (`const` vs. `let`) to permit state modification or access.

#### Error Handling Feedback

Systems to catch invalid commands or structural mismatches and output descriptive terminal errors (such as `TypeError: Assignment to constant variable` or custom verification contradictions) to guide the player's next attempt.

#### Scene Management

A modular system to fetch and load scene-specific background graphics (`image_a960f9.jpg`, `Image 6.jpg`, etc.), character dialogue, interactive object parameters, and hidden clue data via JSON.

### C. Data & Persistence

#### Save States

Use of HTML5 Local Storage to save level progress, unlocked notebook pages, and player wardrobe items.

#### State Recovery

Ability to reload the application within the browser and resume progress from the latest unlocked case step or tutorial checkpoint.

## 4. MVP Content Scope

### Level 0: Bunny's Office (Tutorial)

#### Concepts Taught

Terminal execution, basic object methods, case sensitivity, strings vs. bare variables, and mutating state via `const` and `let`.

#### Visual Assets

2D view of Bunny's detective office workspace.

#### Objective

Run `self.search("look around room")` to discover hidden object variables, provide multi-parameters using `self.search("under", plantPot)` to locate a physical brass key, handle scope errors by changing a restricted `const lockedDrawer` to a mutable `let`, and safely execute the unlock sequence to uncover Bunny's case journal.

### Level 1: The Crust & Crumb Bakery

#### Concepts Taught

Arrays (numbered lists), elements, inspecting item fields via dot notation `.`, adding elements to the end of an array using `.push()`, and custom sorting via `.sort()`.

#### Visual Assets

Progresses through a sequence of scene assets (`Image 1_2.jpg` through `Image 5_2.jpg` alongside `image_a960f9.jpg`) to visually mirror the timeline and shifting damage states of a bakery crime scene.

#### Objective

Iterate through a broken display case using `displayCase.forEach( dessert => { } )`, execute `remainingDessertList.push(dessert.name);` inside the action brackets to build a master evidence checklist, apply a custom family sorting routine using parameter placeholders (`remainingDessertList.sort((dessert1, dessert2) => dessert1.sheepOrdering(dessert2));`), and interview an arriving bat witness to harvest physical culprit characteristics.

### Level 2: The Police Station Suspect Lineup (Game Finale)

#### Concepts Taught

Functions, placeholders (parameters), code try blocks, custom exception handling catch blocks, count variable increments `++`, and template literal string insertion using backticks `` ` `` and `${}`.

#### Visual Assets

Moves to the precinct investigation rooms shown in `Image 6.jpg`, `Image 7.jpg`, and `Image 8.jpg`.

#### Objective

Run `self.search(suspectFiles)` on the desk to layout animal folders (Owl, Dog, Mouse) alongside their structural blueprint properties. Declare a reusable framework function `function crossRef(suspect)`, open a protective execution net using `try { self.readFile(suspect) }`, and pipe sequential error catches (`catch (notBigEars) { contradiction++ }`, etc.) to count profile contradictions. Evaluate the suspects to isolate the target zero-error profile, and complete the final case accusation inside the terminal terminal by writing `console.log(\`I accuse \${suspect3}\`)` within literal backticks to roll the final credits.

## 5. Technical Stack

### Game Engine

Vanilla JavaScript / HTML5 Canvas API (No external game engines)

### Development Foundation

JavaScript (ES6+) / HTML5 / CSS3 Layout Grid

### Data Structure

JSON-based level and state configurations

### CI/CD

GitHub Actions for automated deployment to GitHub Pages upon merges to `main`

## 6. Out of Scope (Post-MVP)

### Progression Skin System

Advanced currency accumulation and unlocking extensive cosmetic accessories or clothing outfits for Bill the Lizard.

### Automated Hint System

In-game progressive hint toggles or automatic object glowing when players get stuck.

### Cloud Database Synchronization

Migrating local browser state persistence away from local storage to a remote cloud database backend.

## 7. Success Criteria

### Criteria 1

The primary typing aspect functions perfectly, meaning the custom vanilla string command parser accurately identifies valid OOP-styled strings and updates the canvas rendering environment state accordingly.

### Criteria 2

The accuracy checker flawlessly handles incorrect typing syntax, bracket mismatching, or scope violations by outputting an appropriate error message to the terminal text panel without crashing the runtime loop.

### Criteria 3

The complete narrative arc spanning Level 0 through Level 2 is fully playable, tracks automated checklist item modifications, and is scale-responsive across both desktop monitors and mobile layouts.

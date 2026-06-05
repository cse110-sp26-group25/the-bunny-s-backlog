# The Bunny's Backlog 🐰🦎

An investigator puzzle game featuring cute animal characters, driven entirely by fundamental JavaScript syntax mechanics. Built for CSE 110 (Spring 2026) by Group 25, KnowIdeas.

Our game is a puzzle-themed typing game designed to help users (around 12 years old) familiarize themselves with the syntax of JavaScript. Story-wise, you play as Bill the Lizard, a tech-support locksmith who steps into an empty office to do routine software updates, only to find that Chief Detective Bunny has suddenly gone missing. Because the town's detective chair is empty and the office security system is operational, the community looks to you to help run commands and crack their active mysteries. Since you're not an actual detective, you are forced to rely on the sliding handwritten journal left by Bunny to help you decode these mysteries, specifically by typing syntax-accurate JavaScript code.

The game interface features a clean, responsive split-screen design. The left side displays a 2D viewport canvas showcasing the visual game environment and interactable animal NPC sprites. The bottom area features a code terminal input box, which the player uses to command Bill the Lizard. The right side holds the persistent sliding notebook containing helpful syntax explanations, alongside an active evidence checklist panel.

For example, a player might search under a plant pot to find a physical key object. However, because the target drawer variable is safely locked down as a `const` (constant variable) in the security system, attempting to unlock it triggers a flashing `TypeError` message. To progress, the player must use `let` to redefine the variable's scope so its state can actually change. Once the program updates, they can execute the unlocking routine to open the drawer and discover the evidence inside.

---

# 1. Project Overview & Core Loop

The Bunny's Backlog is a cozy, narrative-driven investigator puzzle game with a twist. The tone strikes a careful balance: a warm, pastel color palette that is soft and easy on the eyes, paired with character-driven storylines where mysteries feel genuine. Players take on the role of Bill the Lizard, a deadpan, down-to-earth technician who must step out from behind his tech visor to assist the local townspeople.

## The Core Gameplay Loop

### Explore
Use the 2D layout viewport to evaluate the scene and identify interactive physical objects and hotspots.

### Learn
Slide open Bunny's handwritten notebook page in the right panel to read simple syntax rules (Variables, Arrays, Functions, Try/Catch blocks).

### Type (Core Mechanic)
Utilize the code input terminal to type out matching structural code behaviors (such as `let`, `.push()`, or `function`) to interact with objects.

### Resolve
Input commands with zero syntax errors to update the evidence checklist panel, log contradictions, and solve the final case file.

---

# 2. Technical System Architecture & Layout Calculations

The user interface operates on a strictly responsive, fixed-ratio workspace split into a grid matrix of 34 columns by 20 rows calculated by relative measurements.

## Screen Partition Specifications

### Main Game Viewport Canvas (Columns 0–24, Rows 0–18)
Renders the 2D background environments, interactable character sprites (like Baker Sheep and Bat Witness), and pixel-art static object hotspots (like the display case or police desk).

### Terminal Typing Area (Columns 0–24, Rows 18–20)
Features the interactive command-line entry system and live status trackers. It visually adapts to structural code changes, such as highlighting open curly braces `{ }` when typing actions inside functions.

### Persistent Side Panel / The Notebook (Columns 24–34, Rows 0–20)

Contains context-switching tabs:

#### Bunny's Lessons
Contextual, kid-friendly syntax references and JavaScript instructional rules using relatable metaphors (like carrots and snacks).

#### Evidence Checklist
A clean, automated list displaying the level's source-of-truth logs, tracking gathered items (like keys) and evaluated case states.

---

# 3. Functional MVP Engine Requirements

## A. Mechanics & Backend Logic

### Typing Integration Engine
Specialized string parsing framework built within ct.js that functions as the mandatory interface for environmental interaction.

### Syntax Parsing & Verification
Evaluates user-typed strings letter-for-letter against valid runtime configurations. Strictly checks parameters, quotation marks for strings, case sensitivity, and trailing semicolons.

### Scope Validation Engine
Evaluates whether a target object variable is declared using the appropriate keyword (`const` vs. `let`) to permit state modification.

### Error Handling Feedback
Catches invalid commands or structural mismatches and outputs custom, instructional error logs (such as `TypeError: Assignment to constant variable` or tracking explicit structural errors via custom variables) to guide the player.

### Scene Management System
A modular asset loader to dynamically fetch scene-specific background graphics, dialog streams, audio cues (like animal noise folder clicks), and hotspot coordinates via JSON configurations.

## B. Data & Persistence

### Save States & State Recovery
Utilizes HTML5 Local Storage to track level progression and unlocked notebook pages across browser reloads.

---

# 4. MVP Content Scope & Metrics

## Level 0: Bunny's Notebook (Tutorial)

### Concepts Taught
Terminal execution, basic object methods, case sensitivity, strings vs. bare variables, and mutating state via `const` and `let`.

### Visual Environment
Pinned to a 2D view of Bunny's detective office.

### Core Logic Sequence

1. Execute `self.search("look around room")` to find hidden object variables (`plantPot`, `lockedDrawer`).
2. Provide multi-parameters by typing `self.search("under", plantPot)` to locate a physical brass key.
3. Attempt `self.unlock(lockedDrawer, key)`, triggering a `TypeError` due to a strict `const` blocker.
4. Declare `let lockedDrawer` to allow state mutation, rerun the unlock sequence, and discover the bright blue box inside.
5. Trigger a narrative transition by using `console.warn("I am just a lizard technician")` to notify an incoming frantic visitor.

---

## Level 1: The Crust & Crumb Bakery

### Concepts Taught
Arrays (numbered lists), elements, inspecting item fields via dot notation `.`, adding elements to the end of an array using `.push()`, and custom sorting via `.sort()`.

### Visual Environment
Progressively steps through background images `image_a960f9.jpg`, `Image 1_2.jpg`, `Image 2_2.jpg`, `Image 3_2.jpg`, `Image 4_2.jpg`, and `Image 5_2.jpg` to visually mirror the timeline and state of a crime scene.

### Core Logic Sequence

1. Inspect a ruined case from a break-in using:

```javascript
displayCase.forEach(dessert => { });
```

2. Write code within the action brackets to catalog remaining items by their properties, executing:

```javascript
remainingDessertList.push(dessert.name);
```

to gather a messy list of pastries (Cinnamon Swirl, Strawberry Tart, Croissant).

3. Discover the resulting checklist is scrambled. Address Baker Sheep by logging completion using:

```javascript
console.log("I've finished");
```

4. Use a super-secret family sorting routine to structure the messy data by passing parameter placeholders into a custom sort block:

```javascript
remainingDessertList.sort((dessert1, dessert2) => dessert1.sheepOrdering(dessert2));
```

5. Interrogate an arriving Bat Witness to uncover key suspect descriptors (round ears, small height, makes a squeaking sound).

---

## Level 2: The Police Station Suspect Lineup (Finale)

### Concepts Taught
Functions, placeholders (parameters), code try blocks, custom exception handling catch blocks, count variable increments `++`, and template literal string insertion using backticks `` ` `` and `${}`.

### Visual Environment
Moves to the precinct investigation rooms shown in `Image 6.jpg`, `Image 7.jpg`, and `Image 8.jpg`.

### Core Logic Sequence

1. Execute `self.search(suspectFiles)` on the desk to layout animal folders (Owl, Dog, Mouse) and reveal their structural blueprint objects (e.g., `const suspect1 = { earShape: "small", height: "small", sound: "hoot" }`).

2. Write a reusable cross-reference behavior function header:

```javascript
function crossRef(suspect)
```

3. Open code brackets and safely inspect files inside an isolated error safety net:

```javascript
try {
  self.readFile(suspect)
}
```

4. Chain structured error catch handles sequentially to filter out witness contradictions:

```javascript
catch (notBigEars) { contradiction++ }
catch (notSmall) { contradiction++ }
catch (doesNotSqueak) { contradiction++ }
```

5. Execute the completed function on all suspect objects (`crossRef(suspect1)`, etc.) to evaluate contradiction tallies and find a perfect match with 0 errors.

6. Perform the final case accusation input inside the terminal by injecting the correct variable dynamically inside backticks:

```javascript
console.log(`I accuse ${suspect3}`)
```

to completely close out the mystery and roll the game's final credits.

---

# 5. Technology Stack & Automation

## Game Engine
ct.js (v4.x+)

## Development Foundation
JavaScript / HTML5 / CSS3 Canvas APIs

## Data Interchange
JSON-based level configurations

## CI/CD Pipeline
GitHub Actions automated pipeline tracking build status and deploying changes dynamically to GitHub Pages upon merges to `main`.

---

# 6. Project Scope Boundaries (Post-MVP)

## Progression Skin System
Advanced currency tracking and cosmetic outfits for Bill the Lizard.

## Automated Hint System
Continuous progressive hint toggles or automatic object glowing highlights.

## Cloud Database Synchronization
Migrating local browser state persistence away from local storage to a remote cloud database backend.

---

# 7. Setup & Local Development Instructions

## Clone the Repository with Submodules

```bash
git clone --recursive https://github.com/cse110-sp26-group25/the-bunny-s-backlog.git
cd the-bunny-s-backlog
```

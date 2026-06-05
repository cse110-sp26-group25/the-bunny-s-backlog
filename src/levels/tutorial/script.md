# Tutorial Level Script: Bunny's Notebook

## Layout & Spatial Coordination Notes (For UX & Design Team)

Design Alignment Guardrail: To support an intuitive left-to-right scanning motion across the room's workspace artwork, both physical interactable targets are anchored to the left side of the viewport.

plantPot Hotspot Layer: Positioned directly to the left of the main desk bounding box.

lockedDrawer Hotspot Layer: Positioned on the far-left screen border.

## Three-Zone UI Configuration

The Center Viewport: 2D interactive graphic environment of Chief Bunny’s office workspace.

The Slide Panel (Right Side): Contextual layout container that swaps between Bunny's Notebook (lessons) and the Evidence Tracker (variable grid).

The Terminal Console (Bottom): Active interactive text-input command line for player execution.

## Phase 1: Booting & Environment Mapping

### Context

The game opens on Bill the Lizard leaning back at his desk in a dimly lit office. He drops his face into his hands, staring at a blank terminal screen. Suddenly, a chime loops, and the right-hand slide panel forcefully pops open directly to Page 1 of Bunny's Notebook.

### UI Slide Panel (Bunny's Notebook)

"Thanks so much for helping me patch my terminal systems while I'm away, Rookie! ૮꒰˶ᵔ ᵕ ᵔ˶꒱ა

I actually left a little welcome gift for you in my office! The bad news? I think I forgot to take it out of my super-secret locked drawer before I stepped out ૮꒰˶´ ꒳ `꒱ა. But don't worry, the key is hidden somewhere in the room!

I usually start all my big investigations by telling my terminal to run an environment sweep. Try typing this exact single-parameter command into the console below to map our workspace:

self.search("look around room")"

### Environment Matrix State

Center Viewport: Dark office scene. All room assets are unclickable.

Evidence Tracker: Hidden / Uninitialized state.

### Player Input

```javascript
self.search("look around room")
```

### Terminal Output

```plaintext
[SYSTEM]: Scanning local grid coordinates...
[SUCCESS]: Environment data parsed successfully. 
[LOG]: 2 physical assets mapped to volatile memory.
```

### Post-Action UI Update

Visuals: Green bounding boxes pulse around a heavy filing drawer unit (far left) and a leafy potted plant sitting to the left of the desk.

Evidence Tracker Auto-Initializes: (The Scope column remains hidden from view during this phase to avoid data spoilers)

| Variable Identifier | Value | Location |
|---|---|---|
| plantPot | [Physical Asset] | Left side of desk |
| lockedDrawer | [Locked Security Unit] | Far left of screen |

### Character Dialogue

Bill the Lizard: "Terrific. Ten minutes on the clock and Bunny's already got me running automated sweeps. Looks like the terminal indexed two local objects into memory: plantPot and lockedDrawer. Both on my left. Let's inspect the plant first."

## Phase 2: Targeted Inspection (Multi-Argument Syntax)

### Context

The player shifts their focus back to the center viewport, moving their cursor over the plant asset situated to the left of the desk.

Associated Hotspot: plantPot

Hover Tooltip: [Interact]: Is there something hidden under this plantPot?

On-Click Trigger: Clicking the plant forces Bunny's Notebook to automatically flip to Page 2.

### UI Slide Panel (Bunny's Notebook)

"Sometimes a basic sweep isn't enough—we need to be much more specific! We can pass multiple arguments into our search behaviors by separating them with a comma.

For example: self.search("behind", someObject).

But you have to be super careful! The data entries inside our system are incredibly sensitive... you could say they are caseSensitive ૮꒰ - ﻌ •꒱ა! JavaScript cares immensely about lowercase and uppercase letters. Also, parameter order matters completely! Your target direction string always comes first, and the environmental object variable comes second.

Let's look directly beneath the plant: self.search("under", plantPot)"

### Player Input

```javascript
self.search("under", plantPot)
```

### Terminal Output

```plaintext
[SYSTEM]: Evaluating relative spatial parameters...
[LOG]: Position offset applied to object target: plantPot.
[SUCCESS]: Target physical asset uncovered.
```

### Post-Action UI Update

Visuals: The plant pot asset slides horizontally to the side, revealing a glinting, brass physical key sitting on the floorboards.

Evidence Tracker Updates:

| Variable Identifier | Value | Location |
|---|---|---|
| plantPot | [Shifted Baseline] | Left side of desk |
| lockedDrawer | [Locked Security Unit] | Far left of screen |
| key | [Physical Brass Asset] | Floorboards |

### Character Dialogue

Bill the Lizard: "Hiding a physical brass key right under the decor. Truly cutting-edge security, Inspector. Alright, let's take this key object and try it on the lockedDrawer variable on the far left."

## Phase 3: The Immutability Glitch (The Lockout Error)

### Context

The player clicks on the heavy steel filing drawer unit situated on the far left of the screen layout.

Associated Hotspot: lockedDrawer

Hover Tooltip: [Interact]: Try unlocking the drawer mechanism.

On-Click Trigger: The notebook stays on Page 2, but the terminal console flashing header updates to display a helpful baseline usage reminder: Invoke unlock routine: self.unlock(target, tool).

### Player Input

```javascript
self.unlock(lockedDrawer, key)
```

### Terminal Output (Error State)

```plaintext
[TERMINAL ERROR]: TypeError: Assignment to constant variable.
[CRITICAL]: Execution halted. Cannot alter immutable object state.
```

### Post-Action UI Update

Visuals: The key slips smoothly into the drawer lock, but an overlay padlock graphic flashes bright red on the drawer texture. The cylinder refuses to turn.

Evidence Tracker Updates: The hidden Scope / Type column instantly pops into visual existence, exposing the security flags:

| Variable Identifier | Scope / Type | Value | Location |
|---|---|---|---|
| plantPot | const (Object) | [Shifted Baseline] | Left side of desk |
| lockedDrawer | const (Object) | [Locked Security Unit] | Far left of screen |
| key | const (Object) | [Physical Brass Asset] | Floorboards |

### Character Dialogue

Bill the Lizard: "You've got to be kidding me. The physical key slots straight into the lock cylinder, but the internal terminal software just threw a mutability error and froze the mechanism. Look at the tracker—why is a desk drawer hardcoded against modifications as a const? Let me look at Page 3 of Bunny's notes."

## Phase 4: Modifying Memory Scope (Variable Reassignment)

### Context

The player opens Page 3 of Bunny's Notebook to decipher the newly revealed const protection block.

### UI Slide Panel (Bunny's Notebook)

"Oh no! I completely forgot to mention our precinct security layout! ૮꒰˶´ ꒳ `꒱ა

To protect core office objects from being altered by outside hackers, our database initializes environmental references using const. A variable declared with const is immutable—meaning once its initial value is assigned, it can absolutely never be changed! Look at your tracker panel; it's locked down tight as a constant.

If we want an object's properties or status to change dynamically during an investigation, we must declare it using let, which lets our terminal modify its data state!

Let's override the restriction on the drawer by re-scoping it in our current terminal layer. Type this line:

let lockedDrawer"

### Player Input (Action 4A - Memory Scope Override)

```javascript
let lockedDrawer
```

### Terminal Output

```plaintext
[SUCCESS]: Variable scope override successful.
[LOG]: Identifier 'lockedDrawer' reallocated to mutable memory space.
```

### Post-Action UI Update

Evidence Tracker Updates: The locked scope updates seamlessly to reflect the change:

| Variable Identifier | Scope / Type | Value | Location |
|---|---|---|---|
| plantPot | const (Object) | [Shifted Baseline] | Left side of desk |
| lockedDrawer | let (Object) | [Mutable Security Unit] | Far left of screen |
| key | const (Object) | [Physical Brass Asset] | Floorboards |

### Character Dialogue

Bill the Lizard: "Alright, the registry tracking grid updated. The drawer is no longer marked as an immutable constant. Let's run that unlock command one more time to break through to Phase 5."

## Phase 5: Opening Bunny's Drawer (The Unlock Trigger)

### Context

With the scope safely updated to a mutable let variable, the console is cleared to accept the re-execution statement. This final code block serves as the strict conditional gatekeeper that unlocks Phase 5.

### Player Input (Action 4B - Final Execution)

```javascript
self.unlock(lockedDrawer, key)
```

### Terminal Output

```plaintext
[SYSTEM]: Executing function unlock() on target variable...
[SUCCESS]: Lock cylinder rotated 180°. Structural pins disengaged.
[LOG]: Interactive sequence completed. Drawer opened.
```

### Post-Action UI Update

Visuals: The steel drawer unit swings wide open, revealing a bright blue cardboard parcel labeled "Welcome Pack for our New Network Tech!" inside. The main puzzle loop is finalized.

Notebook Update: The notebook instantly swaps to an urgent exit prompt.

## Phase 6: The Client Threat (The Output Warning)

### Context

Before Bill can pull out his welcome package, a heavy rattling pounding sound loop triggers through the office speakers. A highly hyperactive, panicked Sheep wearing a flour-dusted chef's hat and apron bursts through the main precinct door, waving his hooves wildly in the air.

## 1

### The Client Bursts In

### Narrative Transition

The Baker Sheep rushes straight up to Bill's desk layout, completely blocking the open drawer view.

Baker Sheep: "Help! Help! Someone broke into my pastry shop down the main street! The flour is everywhere, my terminal network lines are cut, my receipts are totally corrupted! Detective, you have to grab your badge and help me find the thief!"

## 2

### Clarifying Professional Identity

### Terminal Requirement

A system prompt box flashes directly over Bill the Lizard's avatar face plate.

System Hint: I need to make sure this panicked pastry chef knows I am simply an underpaid network technician, not the chief detective...

Bunny's Notebook panel displays the final syntax instruction: Execute a warning message to print your true workplace role directly to the terminal interface.

### Player Input

```javascript
console.warn("I am just a lizard technician")
```

### Terminal Output

```plaintext
[WARNING]: I am just a lizard technician
```

### Post-Action Dialogue & Level Exit

Baker Sheep: "I don't care if you're a technician, a database engineer, or an alligator! The Chief Detective's chair is empty, but your terminal console is fully logged in! You're the only person in this building with a working console window! Please, I'll pay you in fresh cinnamon rolls, hot biscuits, glazed turnovers—whatever you want! Just come audit my kitchen terminals before the logs wipe themselves!"

Bill the Lizard: (Sighs heavily, pulling off his IT maintenance visor) "Look, I'm just supposed to be running software updates today... but if your store transaction logs are actively corrupted, I can at least dump your raw database files to a backup drive before they overwrite. Keep your biscuits warm, pal. Let's go look at your bakery."

### Visual Transition

The terminal console screen runs a crisp, spinning gold detective badge loading graphic over the entire workspace view, and the entire interface smoothly fades down to absolute black to prepare the game engine assets for the next stage.

[TRANSITION TO LEVEL 1: THE CRUST & CRUMB BAKERY]

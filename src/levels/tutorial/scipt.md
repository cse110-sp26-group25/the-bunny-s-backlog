# Level 0: Bunny's Notebook

## Layout & Design Coordination Notes

**Visual Setup:** Simple three-zone screen. The left side features the 2D detective office art. The bottom is the code input box. The right side holds the sliding handbook and an evidence checklist panel.

**The Rules:** Text in quotes `""` represent strings (actions/directions like `"under"`). Bare words without quotes represent objects you can touch in the room (variables like `plantPot`).

## Phase 1: Reading the Notebook First

### Context

The game opens with Bill the Lizard sitting at his desk, staring blankly at a dark computer screen. A soft chime rings, and the side panel pops open directly to the first page of Bunny's Notebook.

### Slide Panel (Bunny's Notebook - Page 1)

"Thanks so much for helping me look after the office while I'm away, Rookie! ૮꒰˶ᵔ ᵕ ᵔ˶꒱ა

I actually left a little welcome gift for you! The bad news? I think I forgot to take it out of my super-secret locked drawer before I stepped out ૮꒰˶´ ꒳ `꒱ა. But don't worry, the key is hidden somewhere in the room!

I usually start all my mysteries by running a quick room scan to see what I can interact with. Try typing this behavior to look around the office:

self.search("look around room")"

### Player Input

```javascript
self.search("look around room")
```

* **System Output:**

```bash
Scanning room...
Found: plantPot
Found: lockedDrawer
```

### Side Panel Update (Evidence Checklist)

🌿 plantPot

🗄️ lockedDrawer

### Character Dialogue

Bill the Lizard: "Alright, looks like Bunny's notebook was right. The computer screen found two things I can interact with on my left: a plantPot and a lockedDrawer. Let's click on that plant and see if anything is there."

## Phase 2: The Multi-Parameter Plant

### Context

The player moves their mouse to the left and clicks on the plant pot asset.

**Plant Hotspot Message:**  
"Is there something hidden under this plantPot?"

### Slide Panel (Bunny's Notebook - Page 2)

"Sometimes a basic search isn't enough—we need to be way more specific! We can give our actions extra details by separating them with a comma.

For example, if I wanted to look behind a chair, I would type: self.search("behind", someChair).

But you have to be super careful! Our computer system is incredibly sensitive... you could say it's case-sensitive ૮꒰ - ﻌ •꒱ა! Capital letters and lowercase letters matter immensely. Also, the order matters! The direction word in quotes always comes first, and the object variable comes second."

### Player Input

```javascript
self.search("under", plantPot)
```

* **System Output:**

```bash
Searching under the plantPot...
Success! You found a brass key!
```

### Side Panel Update (Evidence Checklist)

🌿 plantPot

🗄️ lockedDrawer

🔑 key

### Character Dialogue

Bill the Lizard: "A physical key hidden right under the leaves. Classic, Inspector. Let's take this key object and try it on the lockedDrawer on the far left."

## Phase 3: The Constant Blocker (The Error)

### Context

The player clicks on the locked drawer asset on the far left of the screen.

**Drawer Hotspot Message:**  
"The drawer is locked tight. Try using your unlock routine: self.unlock(target, tool)"

### Player Input

```javascript
self.unlock(lockedDrawer, key)
```

* **System Output (Error State):**

```bash
🔴 ERROR: TypeError: Assignment to constant variable.
This object is a CONSTANT and cannot be changed!
```

### Character Dialogue

Bill the Lizard: "Wait, what? The key fits into the lock perfectly, but the computer screen just flashed a red error message. It says it's a 'constant variable' and froze up. Let me check the notebook to see what that means."

## Phase 4: Changing the Variables

### Context

The player opens Page 3 of Bunny's Notebook to figure out the error.

### Slide Panel (Bunny's Notebook - Page 3)

"Oh no! I completely forgot to mention our office security! ૮꒰˶´ ꒳ `꒱ა

To protect important office things from being messed with, our computer sets them up using const. A variable made with const is totally unchangeable—meaning once it's set, it stays that way forever! Look at your evidence page; it's locked down tight as a constant.

If we want a variable's status to actually change—like turning a drawer from locked to unlocked—we have to declare it using let. Using let 'lets' our computer change its state!

Let's fix the drawer so we can unlock it. Type this line to let it change:

let lockedDrawer"

### Player Input

```javascript
let lockedDrawer
```

* **System Output:**

```bash
🟢 SUCCESS: lockedDrawer can now be changed!
```

### Character Dialogue

Bill the Lizard: "Okay, the computer log updated. The drawer isn't a permanent constant anymore. Let's try that unlock command one more time!"

## Phase 5: Unlocking the Prize

### Context

The player retries the unlock sequence on the newly updated variable.

### Player Input

```javascript
self.unlock(lockedDrawer, key)
```

* **System Output:**

```bash
🟢 SUCCESS: Click! The lock turns. The drawer is open!
```

### Visuals

The drawer art changes to show it wide open, revealing a bright blue box inside.

## Phase 6: The Panicked Pastry Chef

### Context

Before Bill can grab his welcome package, a loud pounding sound plays. A hyperactive, frantic Baker Sheep wearing a flour-covered chef's hat bursts through the door, waving his hooves.

### Character Dialogue

**Baker Sheep:**  
"Help! Help! Someone broke into my pastry shop down the street! There is flour everywhere, my computer lines are ruined, and my receipts are totally messed up! Detective, you have to grab your badge and help me find the thief! ૮꒰˵😭 🍧 ˵꒱ა"

### System Hint Prompt

(Flashes over Bill's face)

I need to make sure this panicked chef knows I'm just an ordinary computer technician, not the chief detective...

### Slide Panel (Bunny's Notebook - Final Page)

"If you ever need to print a big warning message directly to the screen to tell someone something important, use console.warn("your message")! ૮꒰˶ᵔ ᵕ ᵔ˶꒱ა"

### Player Input

```javascript
console.warn("I am just a lizard technician")
```

* **System Output:**

```bash
⚠️ WARNING: I am just a lizard technician
```

### Post-Action Dialogue

**Baker Sheep:**  
"I don't care if you're a technician, an engineer, or an alligator! The Chief Detective's chair is empty, but your screen is working! You're the only person in this building who can run commands right now! Please, I'll pay you in fresh cinnamon rolls, hot biscuits, glazed turnovers—whatever you want! Just come look at my kitchen computers before the evidence disappears!"

**Bill the Lizard:**  
"(Sighs heavily and takes off his tech visor) Look, I'm just supposed to be doing software updates today... but if your store computer records are actively breaking, I can at least back them up to a drive before they get deleted. Keep your biscuits warm, pal. Let's go look at your bakery."

### Visual Transition

The screen shows a cute gold detective badge graphic spinning on the screen, and the entire office layout smoothly fades to black.

```text
[TRANSITION TO LEVEL 1: THE CRUST & CRUMB BAKERY]
```

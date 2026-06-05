# Level 2: The Police Station Suspect Lineup

## Layout & Design Coordination Notes

**Visual Setup:** Simple three-zone screen. The left side features the 2D police desk art based on Image 6.jpg, showcasing an investigation room with a corkboard, a main computer desk, a filing cabinet, and a holding cell door. The bottom is the code input box. The right side holds the sliding handbook and an evidence checklist panel.

**The Rules:** A Function is a reusable package of commands that performs an action on an object. We use a Placeholder variable (like suspect) inside the function's parentheses () so we can write our instructions ahead of time before running them on real files.

---

# Phase 1: Gathering the Case Files

## Context

Bill the Lizard and Bat Witness stand inside the cozy precinct office shown in Image 6.jpg. Baker Sheep waits near the front desk while the officers retrieve the suspect files. The desk is littered with notebooks, but the main file storage area is empty. The player moves their mouse to the left and clicks on the wooden desk in the middle of the screen.

### Desk Hotspot Message

"The investigation desk is clear. Try running a search on the precinct data storage."

### Character Dialogue

**Police Officer Dog:** "Alright, we brought you down to the station, but things are a bit of a jigsaw puzzle right now. All our prime suspect records are stored inside our system's archive data. Run a quick file search so we can get them laid out on the workspace."

### Slide Panel (Bunny's Notebook - Page 1)

> "To bring dynamic items into a scene, we call our classic search command on the data folder we need.
>
> Let's locate the main folder containing our records. Type this command to grab the profiles:
>
> self.search(suspectFiles)"

### Player Input

#### JavaScript

```javascript
self.search(suspectFiles)
```

### System Output

#### Bash

```bash
🗄️ Scanning precinct archive...
Found: suspectFiles
```

### Side Panel Update (Evidence Checklist)

- 📂 suspectFiles

### Character Dialogue

**Bill the Lizard:** "Alright, the console found the directory. Looks like the system is pulling up the profiles now."

---

# Phase 2: Opening the Animal Folders

## Context

As soon as the command runs, a paper-shuffling sound effect plays. The left background asset swaps to Image 8.jpg, revealing three folder silhouettes on the left side of the screen featuring an owl, a dog, and a mouse profile. The player clicks on the desk again to inspect the blueprints.

### Desk Hotspot Message

"Three folders have appeared. Let's inspect the data layout."

### Slide Panel (Bunny's Notebook - Page 2)

> "Perfect! Each file in our database is stored as an object. To know exactly what clues we are checking, the system sets up a blueprint of traits for each animal profile.
>
> Look at the active file structure pinned to the center of your workspace:
>
> const suspect1 = { earShape: "small", height: "small", sound: "hoot" }"

### Character Dialogue

**Bill the Lizard:** "Okay, the system log updated. The data structure clearly shows suspect1 has small ears, a small height, and makes a 'hoot' sound. Let's see what happens when we click the individual assets to hear their audio records."

### Design Note

Clicking each animal folder silhouette on the left side plays its corresponding audio file (an owl hoot, a dog bark, and a mouse squeak).

**Bill the Lizard:** "So we've got an owl that hoots, a dog that barks, and a mouse that squeaks. Let's put together a script to automatically check all these profiles against the witness statement."

---

# Phase 3: Writing the Function Framework

## Context

The visual panel shifts slightly to Image 7.jpg, bringing a large, blank sheet of paper to the center of the desk workspace, ready for code instructions. The player clicks on the central desk table.

### Desk Hotspot Message

"Wow, that's a lot of suspects!"

### Character Dialogue

**Bat Witness:** "Wow, that's a lot of suspects! Looking through every single folder trait by hand is going to take forever!"

**Police Officer Dog:** "Don't sweat it, wings. We can build a reusable custom behavior script to process these files all at once. Before we write any detailed logic or try-catch safety checks, we need to declare our function header first so the system knows what placeholder variable we're using."

### Slide Panel (Bunny's Notebook - Page 3)

> "Sometimes I need to perform a repetitive task on similar objects over and over again. To help save time, I can write a function to prep how I will behave to some object.
>
> Once I prepare a function like eatCarrot(someCarrot) { } by writing the actions I want to take inside { }, I can call the function over and over again on different objects without having to rewrite all my actions! Like eatCarrot(bigCarrot) or eatCarrot(smallCarrot).
>
> someCarrot acts as a placeholder, so I can prepare and ready my actions before I want to perform them on the real thing! Let's start our file check framework:
>
> function crossRef(suspect)"

### Player Input

#### JavaScript

```javascript
function crossRef(suspect)
```

### System Output

#### Bash

```bash
🟢 SUCCESS: Function crossRef(suspect) header compiled!
```

### Character Dialogue

**Bill the Lizard:** "The function header went through without a hitch. Now we just need to program the internal actions inside the block."

---

# Phase 4: Attending to the Target File

## Context

The user has successfully declared the function header. The entry screen now updates with an open curly brace { indicating that the next instructions will reside inside the function body.

### Slide Panel (Bunny's Notebook - Page 4)

> "Excellent! Now that our function framework has a placeholder ready, the very first internal action we need to take is telling our device to pull up the record sheet.
>
> We wrap our file reading step inside an experimental try routine. This safely attempts the behavior so that if something goes wrong, it won't crash our entire screen console.
>
> Type this block inside the framework to begin:
>
> try { self.readFile(suspect) }"

### Player Input

#### JavaScript

```javascript
try { self.readFile(suspect) }
```

### System Output

#### Bash

```bash
🟢 SUCCESS: Try block created. Ready to process exceptions.
```

### Character Dialogue

**Bill the Lizard:** "Okay, the console accepts the try block. It's ready to scan the contents of whichever suspect we pass into it."

**Police Officer Dog:** "The system is pointing to the right file now. Next, we need a way to filter out anyone who doesn't match the descriptions our witness gave us last night."

---

# Phase 5: Catching the Contradictions

## Context

The player stays focused on the workspace sheet, getting ready to chain the error handling blocks directly underneath the file inspection sequence.

### Character Dialogue

**Police Officer Dog:** "These files contain information regarding our line-up. We're looking for someone who matches the exact profile our bat friend gave us. If anyone doesn’t match the description, it would be an Error to keep them here! For every suspect, let's look out for the explicit mismatches: notBigEars, notSmall, and doesNotSqueak. If one pops up, we'll increment our counter variable."

### Slide Panel (Bunny's Notebook - Page 5)

> "After we try something, we use catch to keep track of the errors that occurred. We specify which particular errors we're looking for inside catch(errorType) and how we should respond to that error with { responseToError }. For example: catch(moldyCarrot) { self.throwAway(carrot); }
>
> Sometimes we don't need to track completely different objects, but rather a simple tally of the same event. To do this, we use a count variable like contradiction. To add to this counter, we use the ++ operator to increment its value by one. To add to my number of carrots, I would type numOfCarrots++.
>
> Let's catch the notBigEars error first to see if it tallies up:
>
> catch (notBigEars) { contradiction++ }"

### Player Input

#### JavaScript

```javascript
catch (notBigEars) { contradiction++ }
catch (notSmall) { contradiction++ }
catch (doesNotSqueak) { contradiction++ }
```

### System Output

#### Bash

```bash
🟢 SUCCESS: Exception handling compiled. All filters active!
```

### Side Panel Update (Evidence Checklist)

- 📂 suspectFiles
- 🛠️ Verification Function Ready

### Character Dialogue

**Bill the Lizard:** "The catch filters compiled successfully. The function is fully set up to record any contradictions it runs into."

---

# Phase 6: Accusing the True Culprit

## Context

The system script finishes compiling. The screen prompt resets to a single line, allowing the player to evaluate the suspects using the freshly constructed rule checking method.

### Player Input

#### JavaScript

```javascript
crossRef(suspect1)
crossRef(suspect2)
crossRef(suspect3)
```

### System Output

#### Bash

```bash
Evaluating suspect1 (Owl)... Total Contradictions: 2 (notBigEars, doesNotSqueak)
Evaluating suspect2 (Dog)... Total Contradictions: 1 (doesNotSqueak)
Evaluating suspect3 (Mouse)... Total Contradictions: 0 (Perfect Match!)
```

### Side Panel Update (Evidence Checklist)

- ❌ suspect1 (Owl) -> 2 errors
- ❌ suspect2 (Dog) -> 1 error
- 🎯 suspect3 (Mouse) -> 0 errors

### Character Dialogue

**Bill the Lizard:** "And there we go. The owl hit two errors, the dog hit one, and the mouse cleared the function with zero contradictions."

**Police Officer Dog:** "Look at that! The owl triggered 2 errors because it has small ears and doesn't squeak, and the dog hit 1 error because it doesn't squeak either. But the mouse profile cleared with zero contradictions! Point out the true thief to the console using a template literal string so we can write up the warrant."

### Slide Panel (Bunny's Notebook - Final Page)

> "We're almost done! Instead of writing heavy checks, we can dynamically insert our suspect right into a text string using the special form ${variableName} inside backticks.
>
> Let's make our official declaration to log the suspect to the system:
>
> console.log(\I accuse ${suspect3}`)`"

### Player Input

#### JavaScript

```javascript
console.log(`I accuse ${suspect3}`)
```

### System Output

#### Bash

```bash
📢 LOG: I accuse suspect3
```

### Character Dialogue

**Bill the Lizard:** "(Sighs softly and closes the console input panel) Round ears, small, and squeaky. Looks like the data lines up perfectly with the mouse file."

**Police Officer Dog:** "Outstanding work, tech guy. The data doesn't lie. We've got our culprit pinned down right down to the exact squeak. Case closed! I'll go get the paperwork ready—and I think a certain baker owes you a giant box of fresh cinnamon rolls."

---

## Visual Transition

The case paperwork on the table smoothly folds shut. The scene cuts to a cheerful, bright graphic of a detective badge stamped with a "CASE CLOSED!" ink ribbon as celebratory music plays, smoothly fading out to the final credits roll.

### Plaintext

```text
[GAME COMPLETE - CREDITS ROLL]
```

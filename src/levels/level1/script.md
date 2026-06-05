# Level 1: The Bakery Case (12 Phases)

## Phase 1: Arriving at the Crumb Scene

**Context:** Bill the Lizard and Inspector Bunny walk into the local bakery. Flour footprints cover the floor, and Sprinkle the Sheep is sobbing by the counter.

**Bunny:**  
"We've arrived at the scene, Bill! Look at poor Sprinkle. Before we check the physical clues, we need to officially open the case file on our terminal. Type: `caseFile.open("bakery");`"

---

## Phase 2: Interviewing the Victim

**Context:** The terminal logs the case opening. Sprinkle wipes her tears and looks up.

**Bunny:**  
"Great, the terminal is logging everything. Now let's ask Sprinkle exactly what happened last night. We'll invoke our communication tool on her object profile. Type: `self.interview("sprinkle");`"

---

## Phase 3: Inspecting the Display Cases

**Context:** Sprinkle explains that she came in at dawn to bake, only to find her glass display cases entirely cleaned out.

**Bunny:**  
"She says the thief completely wiped out the glass displays! Let's use our terminal to run a diagnostic scan on the main storage data layout. Type: `inspect("displayCase");`"

---

## Phase 4: Initializing the Empty Manifest

**Context:** The terminal displays the `displayCase` array, showing remnants of data, but we need a clean slate to track what went missing.

**Bunny:**  
"The scan worked, but it's raw data. We need to create an empty array variable where we can build our clean stolen items manifest. Remember, use `let` so we can modify it later! Type exactly this:"

### JavaScript

```javascript
let missingDessertList = [];
```

---

## Phase 5: Setting Up the Loop Framework

**Context:** The terminal confirms the creation of the empty array.

**Bunny:**  
"Now, we need to inspect every single dessert entry inside that messy `displayCase` array. To do this without writing a hundred lines of code, we use a loop structure called a `forEach` loop. Let's start the framework by calling the loop method on our array. Type:"

### JavaScript

```javascript
displayCase.forEach(dessert => {
```

---

## Phase 6: Extracting and Storing the Data

**Context:** The terminal shows a continuation prompt (`...`), waiting for the inner action of the loop.

**Bunny:**  
"The loop is open! Now, for every single dessert the computer encounters, we want to grab its `.type` property and push it straight into our `missingDessertList` array. Type this next line to do the heavy lifting:"

### JavaScript

```javascript
   missingDessertList.push(dessert.type);
```

---

## Phase 7: Closing the Loop

**Context:** The inner logic is written, and the terminal expects the loop structure to close.

**Bunny:**  
"Perfectly targeted! Now we just need to safely close our loop function bracket and parenthesis so the computer knows the instruction set is complete. Type:"

### JavaScript

```javascript
});
```

---

## Phase 8: Printing the Unsorted Results

**Context:** The loop executes instantly. The terminal blinks, ready for review.

**Bunny:**  
"The loop just ran through the entire bakery inventory! Let's print our new list to the console to see what we're dealing with. Type: `console.log(missingDessertList);`"

---

## Phase 9: Facing the Sheep's Critique

**Context:** The terminal prints:

```javascript
["Croissant", "Apple Pie", "Eclair", "Brownie"]
```

Sprinkle the Sheep peeks at the monitor and frowns.

**Bunny:**  
"Oh, Sprinkle thinks your list looks a bit chaotic! She says a pristine bakery requires everything to be kept in strict alphabetical order. But wait... lizards don't inherently know how to sort text! We need to teach your terminal a custom comparison rule. Type this exact function:"

### JavaScript

```javascript
const compareDesserts = (dessert1, dessert2) => dessert1.localeCompare(dessert2);
```

---

## Phase 10: Executing the Sorting Action

**Context:** The comparison rule is saved into the terminal's system memory.

**Bunny:**  
"Outstanding! Now your terminal understands exactly how to weigh two dessert strings against each other. Let's feed that custom rule directly into our list's built-in sort method. Type: `missingDessertList.sort(compareDesserts);`"

---

## Phase 11: Verifying the Organized Evidence

**Context:** The sort algorithm processes the data quietly.

**Bunny:**  
"Let's print the list one more time to make sure our evidence is beautifully sorted for the official record. Type: `console.log(missingDessertList);`"

---

## Phase 12: A Witness Appears

**Context:** The terminal outputs a perfect, alphabetical list:

```javascript
["Apple Pie", "Brownie", "Croissant", "Eclair"]
```

Suddenly, a rustling sound comes from the doorway. A nocturnal animal steps into the light.

**Nocturnal Animal:**  
"Pardon me... I heard a massive crash outside my burrow last night. Did someone break into the sweet shop?"

**Sprinkle:**  
"Yes! Did you see who did it?!"

**Nocturnal Animal:**  
"It was quite dark, but I can tell you three things: they had round ears, they were small, and I distinctly heard them squeak as they ran off!"

**Bunny:**  
"A physical profile! Sensational work, Bill. Our bakery list is cataloged, and we have our suspect traits. Let's head straight to the local holding cells to crack this case!"

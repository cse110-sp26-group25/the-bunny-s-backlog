# Terminal Detective: Tutorial Level Script

## Tutorial Level: Calibrating the Interrogation Terminal

### Phase 1: Reading Bunny's Notebook

**Context:** The game starts with Bill the Lizard at his desk in a dimly lit office. A side panel flashes, forcing Chief Inspector Bunny's notebook to open to teach the player how to interact with the environment.

**Side Panel (Bunny's Notebook):**  
"Welcome to the team, Rookie! To start any good investigation, we need to inspect the crime scene materials. We always start our terminal sweep by telling ourselves to scan our target data files! Try typing: `self.search(suspectFiles)`"

**Player Input:**

```javascript
self.search(suspectFiles)
```

---

### Phase 2: Opening the Suspect Directory

* **Context:** The terminal executes the search. A crisp paper-shuffling sound effect plays through the speakers. The background updates from the blank office view to a close-up of **the desk in the middle of the screen**, revealing three physical folders with animal pictures on them.
* **Terminal Output:** `[SYSTEM INFO]: Directory mapping successful. Suspect files loaded to desk layout.`
* **Lizard Dialogue:** _"The desk is clear now. Let's look closer at these case folders to see who the precinct brought in."_

---

### Phase 3: Activating the Folders (Biometric Data)

* **Context:** The player hovers over and clicks on the file folders hotspot on the desk. The terminal plays a sequence of clear animal audio cues: a deep **hooting noise** for the owl, a sharp **barking noise** for the dog, and a rapid **squeaking noise** for the mouse. The screen transitions to show a giant folder open in the center of the viewport.

* **On-Screen Display (Text on Folder):**

```javascript
const suspect1 = {
  earShape: ____,
  height: ___,
  sound: ___,
}
```

**Lizard Dialogue:**  
"Ah, look at this object structure! This tells us exactly what parameters we need to refer to when checking each suspect's physical profile. Let's get our function ready."

---

### Phase 4: Meeting the Police Officer

**Context:** A grizzly Police Officer character steps into the frame next to Bill's desk, looking overwhelmed by paperwork.

**Officer:**  
"Wow, that's a lot of suspects to get through, Rookie. We need a fast, automated way to cross-reference their traits against the witness statement. Before you write any advanced safety logic, you need to establish a master code framework. Start by setting up the function header!"

---

### Phase 5: Learning the Function Lesson

**Context:** The side panel automatically flips to the first lesson page in Bunny's Notebook to guide the player through function creation.

**Side Panel (Bunny's Notebook):**  
"Sometimes I need to perform a repetitive task on similar objects over and over again. To help save time, I can write a function to prep how I will behave to some object. Once I prepare a function like `eatCarrot(someCarrot) {}` by writing the actions I want to take inside the curly brackets `{}`, I can call that function over and over on different objects without rewriting my code! `someCarrot` acts as a placeholder so I can ready my actions before I perform them on the real thing!"

**Player Input:**

```javascript
function crossRef(suspect) {
```

**Terminal Output:**  
`... [Function Wrapper Opened]`

---

### Phase 6: The Interrogation Warning (The Try Block)

* **Context:** The function framework is open. The terminal prompt indents, waiting for the first internal instruction.

* **Officer:** _"Perfect, the wrapper is ready. Now listen up: these criminal files are highly confidential and encrypted. If we try to read an invalid file directly, it could throw a system error and crash your terminal. The very first action inside your function must be a safe attempt to read the file. Open a `try` block and read the data parameter!"_

* **Player Input:**

```javascript
try { self.readFile(suspect) }
```

**Terminal Output:**  
`... [Safe Execution Block Established]`

---

### Phase 7: Tracking Contradictions (The Lesson on Catch)

**Context:** The try block is successfully logged. The Police Officer points to a chalkboard on the wall showing a list of suspect descriptions provided by the witness.

**Officer:**  
"These files contain information regarding the suspects. We're looking for someone who matches the description the Bat gave us last night! If anyone doesn't match that description, it would be an Error to keep them here. For every suspect, let's keep track of the number of errors, or contradictory evidence. Let's see what the Notebook says about catching errors."

---

### Phase 8: Reading the Catch and Counter Rules

**Context:** The side panel updates, showing Bunny's guide on handling exceptions and using numerical counters.

**Side Panel (Bunny's Notebook):**  
"After we try something, we use catch to keep track of the errors that occurred! We specify which particular errors we're looking for inside `catch(errorType)` and how we should respond inside `{responseToError}`. Example: `catch(moldyCarrot) { self.throwAway(carrot) }`. Sometimes we don't need to track different objects, but rather a count of occurrences. To do this, we use a count variable, like `contradiction`. To add to this counter, we use `++` to increment by 1!"

---

### Phase 9: Catching the First Error (notBigEars)

**Context:** The player is ready to write the first error handler. The Officer speaks the explicit error token aloud so the user knows what to filter for.

**Officer:**  
"The Bat said the suspect had big ears. So, our first contradiction happens if the system flags the `notBigEars` error. Let's write a catch block to increment our contradiction counter if that happens!"

**Player Input:**

```javascript
catch (notBigEars) { contradiction++ }
```

**Terminal Output:**  
`... [Error Handler 1/3 Bound]`

---

### Phase 10: Catching the Second Error (`notSmall`)

* **Context:** The first error condition is stored in memory. The terminal waits for the next structural catch block.

* **Officer:** _"Excellent. Next up, the witness stated the thief was small. If the file returns a **`notSmall`** error, that's another contradiction we need to log. Write the second catch block!"_

* **Player Input:**

```javascript
catch (notSmall) { contradiction++ }
```

**Terminal Output:**  
`... [Error Handler 2/3 Bound]`

---

### Phase 11: Catching the Third Error (doesNotSqueak)

**Context:** The second block is saved. The player must now handle the final acoustic trait discrepancy.

**Officer:**  
"Last one! The witness distinctly heard them squeak. If the terminal throws a `doesNotSqueak` error, tick that contradiction counter up one more time and close out the function!"

**Player Input:**

```javascript
catch (doesNotSqueak) { contradiction++ }
}
```

**Terminal Output:**  
`SUCCESS: function crossRef() successfully compiled with 3 error filters.`

---

### Phase 12: Executing the Cross-Reference on Suspect 1

* **Context:** The complete interrogation algorithm is loaded into the terminal. The desk hotspot highlights, pointing to the first case file (the Owl).

* **Officer:** _"The program is completely live, Bill! Let's put it to work. Run your `crossRef` function on our first suspect, the owl, to see how many contradictions pop up."_

* **Player Input:**

```javascript
crossRef(owl)
```

**Terminal Output:**

```text
[PROCESSING]: Reading file: Oliver_the_Owl.dat...
[CAUGHT]: notBigEars -> contradiction incremented.
[CAUGHT]: doesNotSqueak -> contradiction incremented.
>> Evaluation Finished. Total Errors Found: 2
```

---

### Phase 13: Executing the Cross-Reference on Suspect 2

**Context:** The terminal displays the evaluation readout for the owl. The officer gestures to the second folder.

**Officer:**  
"Two contradictions for the owl! He clearly doesn't match the profile. Now let's run the program on our second file slot: the dog."

**Player Input:**

```javascript
crossRef(dog)
```

**Terminal Output:**

```text
[PROCESSING]: Reading file: Barnaby_the_Dog.dat...
[CAUGHT]: notBigEars -> contradiction incremented.
>> Evaluation Finished. Total Errors Found: 1
```

---

### Phase 14: Executing the Cross-Reference on Suspect 3

* **Context:** The dog returns 1 contradiction. The final folder highlights on the desk mesh.

* **Officer:** _"Only one error for the dog, but a true detective needs a perfect match. Run the cross-reference on our final suspect: the mouse!"_

* **Player Input:**

```javascript
crossRef(mouse)
```

**Terminal Output:**

```text
[PROCESSING]: Reading file: Mitzi_the_Mouse.dat...
>> Evaluation Finished. Total Errors Found: 0
```

**Officer:**  
"Look at that! Zero errors! We found our culprit!"

---

### Phase 15: Learning Template Literals (${})

**Context:** The Officer turns to the terminal screen and preps Bill for the formal booking declaration.

**Officer:**  
"Now we need to issue a formal accusation to lock this case down. Instead of just printing plain text, I want to teach you a professional trick called a Template Literal. By using backticks and wrapping an object name inside `${}`, we can inject our suspect variable directly into our statement string dynamically. Let's make the official accusation!"

**Player Input:**

```javascript
console.log(`I accuse ${suspect3}`)
```

**Terminal Output:**  
`OUTPUT: I accuse Mitzi the Mouse`

---

### Phase 16: Closing the Case (Level Transition)

* **Context:** The terminal flashes green. The cell door animations slam shut on the background panel, locking the mouse away securely.

* **Officer:** _"Outstanding work, Rookie! You mapped the files, tracked down the exact contradictions using customized catch handling, and used a clean string expression to seal the deal. You're a natural terminal detective. Grab your gear—we just got a priority call from the local bakery down the street, and they need a coder right away!"_

* **Context:** The terminal screen plays a quick badge animation, and the scene fades to black to prepare for Level 1.

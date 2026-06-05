# Level 2: The Jail Case (15 Phases)

## Phase 1: Reviewing the Detention Log

**Context:** Bill and Bunny arrive at the jailhouse. Three suspects sit behind iron bars: an Owl, a Dog, and a Mouse.

**Bunny:**  
"We're inside the detention block, Rookie. Before we start poking around, let's boot up the jail's secure database terminal so we can interface with the suspect profiles. Type: `jailTerminal.boot();`"

---

## Phase 2: Accessing Suspect Files

**Context:** The database terminal hums to life, showing encrypted files.

**Bunny:**  
"Excellent. To cross-reference our witness's clues, we need to inspect the individual digital files of our suspects. Let's open the suspect directory array. Type: `inspect("suspects");`"

---

## Phase 3: Creating the Tracker Profile

**Context:** The terminal displays three profiles, but they are full of raw biometric data.

**Bunny:**  
"We need a temporary object structure in our code to hold the exact traits we are looking for. Let's declare an empty suspect matching template using let. Type this out carefully:"

### JavaScript

```javascript
let targetProfile = { earShape: "", height: "", sound: "" };
```

---

## Phase 4: Understanding System Crashes (The Try Block)

**Context:** Bill attempts to query a suspect's audio log directly, causing a warning light to flash on the console.

**Bunny:**  
"Whoa, watch out! Interrogating secure criminal databases can throw dangerous system exceptions that will completely lock your console if a file is corrupted. To safely test data, we must wrap our investigation steps inside a defensive structure called a try block. Let's start building a master verification function. Type:"

### JavaScript

```javascript
function verifySuspect(suspect) {
```

---

## Phase 5: Initiating the Try Boundary

**Context:** The function opens, awaiting its internal logic blocks.

**Bunny:**  
"Great. Now, right at the start of our function, we need to open up that protective try gateway so the computer knows to watch for errors. Type:"

### JavaScript

```javascript
    try {
```

---

## Phase 6: Setting Up the Score Counter

**Context:** The terminal indents, waiting for the logic that executes safely inside the try block.

**Bunny:**  
"Inside the safety of the block, we need a counter variable to track how many physical traits a suspect matches. Let's initialize a counter at zero. Type:"

### JavaScript

```javascript
        let evidencePoints = 0;
```

---

## Phase 7: Checking the First Trait (Ears)

**Context:** The counter is live. Now the terminal needs to compare structural features.

**Bunny:**  
"Time to test our witness’s first clue: the round ears! We’ll use an if statement to check if the suspect’s earShape property matches our description. If it does, we increase our evidence points. Type:"

### JavaScript

```javascript
        if (suspect.earShape === "round") { evidencePoints++; }
```

---

## Phase 8: Checking the Second Trait (Height)

**Context:** The first condition is locked in.

**Bunny:**  
"Brilliant. Now let's append our second physical check right below it. We need to see if the suspect's height matches the 'small' classification from the crime scene report. Type:"

### JavaScript

```javascript
        if (suspect.height === "small") { evidencePoints++; }
```

---

## Phase 9: Checking the Third Trait (Sound)

**Context:** The height condition is stored successfully.

**Bunny:**  
"Perfect pacing! Now for the final biometric verification step: checking if the sound property matches a 'squeak'. Type this final check line:"

### JavaScript

```javascript
        if (suspect.sound === "squeak") { evidencePoints++; }
```

---

## Phase 10: Closing the Testing Block

**Context:** All three conditional trait checks have been written.

**Bunny:**  
"The trait scanners are fully written! Let's seal off this inner try instruction sequence so we can handle any potential system errors next. Type:"

### JavaScript

```javascript
    }
```

---

## Phase 11: Implementing the Error Catch

**Context:** The try block closes, and the terminal prompts for the safety mechanism.

**Bunny:**  
"If anything breaks inside that data scan, we need a fallback plan so our terminal doesn't explode. We call this a catch block. Let's write it to log any biological data errors safely without crashing. Type:"

### JavaScript

```javascript
    catch (error) { console.log("Biometric read failed."); }
```

---

## Phase 12: Building the Final Resolution (Finally Block)

**Context:** The catch safety net is established.

**Bunny:**  
"Now for the cool part: the finally block! This block runs no matter what, whether the code succeeded or hit a glitch. This is where we check if our suspect accumulated a perfect score of 3 evidence points to trigger an arrest! Type:"

### JavaScript

```javascript
    finally {
```

---

## Phase 13: The Accusation Logic

**Context:** The finally block opens, waiting for the judgment script.

**Bunny:**  
"Inside the resolution block, let's write the rule: if they have exactly 3 points, we call our official accusation command. Otherwise, we log their score and keep looking. Type this entire evaluation block:"

### JavaScript

```javascript
        if (evidencePoints === 3) {
            self.accuse(suspect.name);
        } else {
            console.log(suspect.name + " cleared. Points: " + evidencePoints);
        }
    }
}
```

---

## Phase 14: Scanning the First Suspects (Owl and Dog)

**Context:** The full verification function compiles beautifully into the system memory.

**Bunny:**  
"Our defensive interrogation algorithm is completely live, Bill! Let's put it to work. Let's run our test on Suspect #1, Oliver the Owl, and Suspect #2, Barnaby the Dog. Type: `verifySuspect(owl); verifySuspect(dog);`"

**Terminal plays a loud hoot, then a deep bark, and outputs:**

```text
Oliver the Owl cleared. Points: 1
Barnaby the Dog cleared. Points: 1
```

---

## Phase 15: Solving the Mystery

**Context:** The first two suspects are cleared by the system logic. Only one suspect remains in the corner of the detention block.

**Bunny:**  
"Neither of them have the traits! This is it, Rookie. Run our verification script on Suspect #3, Mitzi the Mouse! Let's close this investigation! Type: `verifySuspect(mouse);`"

**Terminal plays a sharp, high-pitched squeaking audio effect, followed by flashing green text:**

```text
[CRITICAL MATCH FOUND] Evidence points: 3.
Executing legal action: self.accuse("Mitzi the Mouse");
```

**Bunny:**  
"Boom! Direct hit! The code doesn't lie, Bill. You safely managed complex data properties, protected your machine with error-handling try-catch blocks, and isolated the real bakery bandit. Another case filed away perfectly!"

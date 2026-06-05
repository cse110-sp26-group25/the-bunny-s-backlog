## Level 1: The Bakery Case (12 Phases)

### Phase 1: Arriving at the Crumb Scene
**Context:** Bill the Lizard and Inspector Bunny walk into the local bakery. Flour footprints cover the floor, and Sprinkle the Sheep is sobbing by the counter.  
**Bunny:** *"We've arrived at the scene, Bill! Look at poor Sprinkle. Before we check the physical clues, we need to officially open the case file on our terminal. Type: `caseFile.open("bakery");`"*

### Phase 2: Interviewing the Victim
**Context:** The terminal logs the case opening. Sprinkle wipes her tears and looks up.  
**Bunny:** *"Great, the terminal is logging everything. Now let's ask Sprinkle exactly what happened last night. We'll invoke our communication tool on her object profile. Type: `self.interview("sprinkle");`"*

### Phase 3: Inspecting the Display Cases
**Context:** Sprinkle explains that she came in at dawn to bake, only to find her glass display cases entirely cleaned out.  
**Bunny:** *"She says the thief completely wiped out the glass displays! Let's use our terminal to run a diagnostic scan on the main storage data layout. Type: `inspect("displayCase");`"*

### Phase 4: Initializing the Empty Manifest
**Context:** The terminal displays the `displayCase` array, showing remnants of data, but we need a clean slate to track what went missing.  
**Bunny:** *"The scan worked, but it's raw data. We need to create an empty array variable where we can build our clean stolen items manifest. Remember, use `let` so we can modify it later! Type exactly this:"*

``javascript
let missingDessertList = [];

### Phase 5: Setting Up the Loop Framework
**Context:** The terminal confirms the creation of the empty array.  
**Bunny:** *"Now, we need to inspect every single dessert entry inside that messy display case array. To do this without writing a hundred lines of code, we use a loop structure called a `forEach` loop. Let's start the framework by calling the loop method on our array. Type:"*

``javascript
displayCase.forEach(dessert => {
});

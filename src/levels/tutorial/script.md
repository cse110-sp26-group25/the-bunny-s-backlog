### Phase 1: Calibrating the Terminal
**Context:** The game starts. Bill the Lizard is at his desk, and Chief Inspector Bunny walks in.

**Bunny:** "Welcome to the agency, Rookie! I'm Chief Inspector Bunny. Before we can solve any mysteries, we need to make sure your Detective Terminal is online. In JavaScript, we make the computer speak using a command called `console.log`. Let's test it by saying hello! Type exactly this: `console.log("hello");`"

---

### Phase 2: Scanning the Room
**Context:** The terminal prints "hello" and goes online. Bunny realizes she lost her journal.

**Bunny:** "Perfect, we are online! Now, I have a bit of a problem... I lost my main investigation journal somewhere in this messy office. Let's use the terminal to run a sweep of the room. To use a tool, you type its name, followed by your target inside quotes. Try typing: `scan("office");`"

---

### Phase 3: Checking the Desk
**Context:** The scan reveals the desk, plant, and drawers.

**Bunny:** "Great job! The scanner found my desk, a potted plant, and some wooden drawers. I usually leave my journal right on my workspace. Let's use the inspect tool to look closer at it. Type: `inspect("desk");`"

---

### Phase 4: Reading the Wrong Item (Trial)
**Context:** The inspect command reveals a coffee mug, an open book, and a clipboard.

**Bunny:** "Hmm, no journal. But look! There is an `open_book` and a `clipboard`. In code, things are called 'objects', and we can make them do actions by connecting them with a dot. Let's try reading that book first to see if it's my journal. Type: `desk.read("open_book");`"

---

### Phase 5: Reading the Right Item
**Context:** The terminal says it's just a dictionary.

**Bunny:** "Ah, false alarm. That’s just my dictionary. Nothing useful there! But that's okay, detectives have to explore! Let's check the clipboard instead. Remember the dot notation! Type: `desk.read("clipboard");`"

---

### Phase 6: Finding the Key
**Context:** The clipboard note says to check the foliage (plant) for the key.

**Bunny:** "Aha! The note says I hid the spare key in the foliage... that must mean the potted plant! Use your inspect tool again, but this time change your target to the plant. Type: `inspect("plant");`"

---

### Phase 7: Picking up the Key
**Context:** A shiny silver key is spotted hovering in the plant leaves.

**Bunny:** "There it is! A silver key! In this game, *you* are an object too, and your code name is `self`. To pick things up and put them in your inventory, you have to tell yourself to take them. Type: `self.take("key");`"

---

### Phase 8: Trying to Open Early (Intentional Error)
**Context:** The key is in the inventory. The player needs to get to the drawers.

**Bunny:** "Got it! Now, the note said my journal is in the wooden drawers. Let's head over there and try to open them! Some commands don't need any targets inside the parentheses. Type: `drawers.open();`"

---

### Phase 9: Unlocking the Drawers
**Context:** The terminal flashes a red ERROR: Access Denied. The drawers are locked.

**Bunny:** "Oops! Did you see that red Error? Computers follow exact logic—we can't open a locked door without unlocking it first! We need to use the unlock action and pass the `key` we found as our target. Type: `drawers.unlock("key");`"

---

### Phase 10: Retrieving the Journal
**Context:** The padlock clicks open and turns green.

**Bunny:** "Hear that click? The security lock is disabled! Now it is safe to open them. Try that exact same command from earlier, with the empty parentheses: `drawers.open();`"

**Context:** The drawers open and the journal is acquired.

**Bunny:** "You found it! Fantastic work, Bill. You already know how to use strings, functions, and dot notation! You are going to be a natural JavaScript Developer. Come on, let's head over to the Bakery to catch a thief!"

graph TD
    %% Global States
    Start((Start App)) --> Init[Initialize LocalStorage]
    Init --> Menu{Main Menu}
    
    %% Navigation & Exploration
    Menu -->|Start Run| Explore[Explore Open World]
    Explore -->|Arrow Keys/Touch| Map[Update 2D Array Position]
    Map -->|Check Collision| Event{Tile Event?}
    
    %% Combat Loop (The Typing Engine)
    Event -->|Enemy Encounter| Combat[[Typing Combat Mode]]
    Combat --> Input[Intercept Keydown Event]
    Input --> Validate{Is Char Correct?}
    
    Validate -- Yes --> UI_Success[Highlight Green + Increment Index]
    Validate -- No --> UI_Error[Shake UI + Subtract Player HP]
    
    UI_Success --> WinCheck{String Complete?}
    WinCheck -- No --> Input
    WinCheck -- Yes --> Loot[Generate Item Object]
    
    %% Inventory Logic (Data Architecture focus)
    Loot --> Inv[Update Inventory JSON]
    Inv --> Stats[Apply Buffs to WPM/Accuracy Logic]
    Stats --> Explore
    
    %% Failure State
    UI_Error --> DeathCheck{HP <= 0?}
    DeathCheck -- No --> Input
    DeathCheck -- Yes --> GameOver[Runtime Termination]
    GameOver --> Menu

## System Workflow: 

This diagram represents the core logic of **Compile Quest**, focusing on the lifecycle of a single "Run" and the data flow between exploration, combat, and inventory systems.

### 1. Initialization & State Persistence
*   **App Launch:** The system starts by initializing `LocalStorage` to check for saved game states, unlocked items, or high scores.
*   **Main Menu:** The player enters the central hub where they can adjust settings or begin a new "Run".

### 2. Exploration & Movement
*   **Open World:** The player navigates a tile-based map rendered via CSS Grid.
*   **Collision Detection:** Every movement updates the player's position in a 2D array and checks the "Tile Event" properties of the new coordinates.

### 3. The Typing Combat Engine (Core Mechanic)
*   **State Transition:** When a tile event triggers an encounter, the game switches to **Typing Combat Mode**.
*   **Event Interception:** The engine uses a Vanilla JS `keydown` listener to capture every keystroke.
*   **Validation Logic:** The system compares the player's input against a target syntax string.
    *   **Success Path:** Correct characters trigger green text highlights and increment the progress index.
    *   **Failure Path:** Typos trigger a visual "UI Shake" and subtract health from the player's HP.

### 4. Inventory & Data Architecture
*   **Loot Generation:** Successfully completing a syntax string generates a new `Item Object`.
*   **Data Update:** This object is pushed to the **Inventory JSON**, which is then synced back to `LocalStorage` for persistence.
*   **Buff Application:** The `GameState` recalculates player attributes (like Accuracy or WPM) based on the current inventory before returning to exploration.

### 5. Failure State (Permadeath)
*   **Death Check:** After every error, the system checks if `HP <= 0`.
*   **Runtime Termination:** If the player runs out of health, the current "Run" state is cleared (Rogue-like permadeath), and the player is returned to the Main Menu.

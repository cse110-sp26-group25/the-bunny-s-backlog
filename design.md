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

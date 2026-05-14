graph TD
    A[User Keypress] --> B{Validation Logic}
    B -- Correct --> C[Update Current Index]
    B -- Incorrect --> D[Subtract HP]
    C --> E{String Complete?}
    E -- Yes --> F[Enemy Defeated / Loot Drop]
    E -- No --> G[Wait for next Key]
    D --> H{HP <= 0?}
    H -- Yes --> I[Runtime Termination / Game Over]
    H -- No --> G

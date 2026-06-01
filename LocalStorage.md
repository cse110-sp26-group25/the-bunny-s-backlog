# Local Storage Save Data Documentation

## Purpose

This document explains what information is stored in local storage and what each index in the saved array represents.

The game should use local storage to keep important player progress after the player refreshes the page, closes the tab, or returns later. Temporary UI states, such as hover popups or current animations, should not be saved unless they affect permanent progress.

## Basic Storage Format

The save data is stored as one array, then converted into a JSON string before being saved in `localStorage`.

```js
localStorage.setItem("bunnysBacklogSave", JSON.stringify(saveData));
```

To load the data back into the game, parse the JSON string:

```js
const saveData = JSON.parse(localStorage.getItem("bunnysBacklogSave"));
```

## Save Data Index Reference

| Index | Name | Type | Description | Example |
|---|---|---|---|---|
| 0 | `saveVersion` | Number | Tracks the version of the save format. This helps if the save structure changes later. | `1` |
| 1 | `currentLevel` | String | Stores the level the player is currently on. | `"tutorial_office"` |
| 2 | `currentCheckpoint` | String | Stores the player's current progress point inside the level. | `"found_hidden_key"` |
| 3 | `inventory` | Array | Stores item IDs for items the player has collected. | `["hidden_key", "case_journal"]` |
| 4 | `cluesFound` | Object | Tracks which clues have already been discovered by the player. | `{ "plant_key": true }` |
| 5 | `objectStates` | Object | Tracks permanent object changes in the scene, such as locked, opened, searched, visible, or collected states. | `{ "desk_drawer": { "locked": false, "opened": true } }` |
| 6 | `unlockedNotebookPages` | Array | Stores notebook/tutorial pages the player has unlocked. | `["objects", "scope", "methods"]` |
| 7 | `terminalHistory` | Array | Stores important terminal commands or messages that should remain in the terminal log. | `["self.search(plantPot);", "Success: You found a hidden key."]` |
| 8 | `settings` | Object | Stores player settings, such as volume, muted status, text speed, and reduced motion. | `{ "volume": 1, "muted": false }` |
| 9 | `tutorialCompleted` | Boolean | Tracks whether the tutorial level has been completed. | `false` |

## Information Needed From Other Groups

### Group A: Characters, Level Creation, Backgrounds, Animations, Sounds

Needed information:

- Level IDs
- Checkpoint names
- Clue IDs
- Interactable object IDs
- Permanent scene changes
- Character states that should persist
- One-time animations that should not replay after refresh
- Sound or volume settings that should persist

### Group B: UI/UX, Gameplay Loop, Mobile Detection, Throttling, CI/CD

Needed information:

- UI elements that should stay unlocked
- Terminal messages that should stay in the log
- Gameplay progress values
- Mobile layout settings, if any need to persist
- Accessibility settings, such as reduced motion
- Any saved data needed for testing or deployment

## Notes

If another teammate needs additional information saved, a new index can be added at the end of the array. Avoid changing the meaning of existing indexes unless the `saveVersion` is updated.

# Local Storage Save Data Documentation

## Purpose

This document explains what information is stored in local storage and what each index in the saved array represents.

The game should use local storage to keep important player progress after the player refreshes the page, closes the tab, or returns later. Temporary UI states, such as hover popups or current animations, should not be saved unless they affect permanent progress.

`local_storage.js` defines the shared save key, default save array, settings helpers, and level-select progress helpers. Refactored in-level gameplay should use the `LevelStorage` class in `src/engine/storage.js`; that class saves the current level's refresh/resume state separately and marks shared level-select progress complete when a level is finished.

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
| 1 | `currentLevel` | String | Stores the level the player is currently on. | `"tutorial_morning_routine"` |
| 2 | `currentCheckpoint` | String | Stores the player's current progress point for shared progress systems. | `"found_hidden_key"` |
| 3 | `inventory` | Array | Stores item IDs for items the player has collected. | `["hidden_key", "case_journal"]` |
| 4 | `cluesFound` | Object | Tracks which clues have already been discovered by the player. | `{ "plant_key": true }` |
| 5 | `objectStates` | Object | Tracks permanent object changes in shared progress, such as locked, opened, searched, visible, or collected states. | `{ "desk_drawer": { "locked": false, "opened": true } }` |
| 6 | `unlockedNotebookPages` | Array | Stores notebook/tutorial pages the player has unlocked. | `["objects", "scope", "methods"]` |
| 7 | `terminalHistory` | Array | Stores terminal lines that should replay after reload. Each line has text and CSS class. | `[{ "text": "> scan(\"office\");", "cls": "cmd" }]` |
| 8 | `settings` | Object | Stores player settings. Settings controls preview immediately on the settings page, then save here when the player clicks Apply. | `{ "masterVolume": 80, "musicVolume": 60, "effectsVolume": 75, "hardMode": false }` |
| 9 | `tutorialCompleted` | Boolean | Tracks whether the tutorial level has been completed. | `false` |
| 10 | `levelProgress` | Object | Tracks which levels are unlocked and completed. This supports level selection and continue-game behavior. | `{ "level_001": { "unlocked": true, "completed": false } }` |

## Current Level IDs

Use the same level ID everywhere when saving, loading, selecting levels, or resuming progress.

| Level | ID |
|---|---|
| Tutorial | `tutorial_morning_routine` |
| Level 1 | `level_1_bakery` |
| Level 2 | `level_2_police_station` |
| Level 3 | `level_3_placeholder` |
| Level 4 | `level_4_placeholder` |
| Level 5 | `level_5_placeholder` |

If a level group chooses a different final ID, update the shared `LEVEL_IDS` object in `local_storage.js`, update any matching ids in `LevelStorage`, and use that value everywhere.

## Storage Layers

The project currently has two local storage layers:

- `local_storage.js` stores user settings and level-select/overall game progress in the shared `bunnysBacklogSave` array.
- `src/engine/storage.js` stores the current level's resume state through the `LevelStorage` class and calls `markLevelComplete(levelId)` from `local_storage.js` when a saved level state is complete.

## Settings Behavior

Settings are stored at index 8 of `bunnysBacklogSave`:

```js
{
  masterVolume: 80,
  musicVolume: 60,
  effectsVolume: 75,
  hardMode: false
}
```

The settings page loads these values with `loadSettings()`. Slider movement and the hard-mode toggle update the page preview immediately, but they do not write to local storage until Apply is clicked. Apply calls `saveSettingsData(settings)`, which normalizes the values and writes them back to index 8 without overwriting the rest of the save array.

Pages that load `local_storage.js` call `applyGlobalSettings()` on startup. That applies saved settings to page state and to any `audio` or `video` element:

- `data-volume-type="music"` uses `masterVolume * musicVolume`
- `data-volume-type="effects"` uses `masterVolume * effectsVolume`
- untyped media uses `masterVolume`

Old or malformed saved settings are normalized back to defaults so a bad GitHub Pages `localStorage` value does not break the settings page.

The refactored game calls `LevelStorage`:

- `load(levelId)` once when the level starts
- `save(levelId, levelState)` after every player command
- `clear(levelId)` when the player resets the level

For `tutorial_morning_routine`, `LevelStorage` stores this state under `bunnysBacklog.level.tutorial_morning_routine`:

```js
{
  phase: 1,
  inventory: [],
  unlocked: {},
  errors: 0,
  complete: false,
  terminalHistory: []
}
```

When `LevelStorage.save()` receives a state with `complete: true`, it calls `markLevelComplete(levelId)` from `local_storage.js` so level-select progress is updated in the shared array.

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

If another teammate needs additional information saved to the shared game progress, a new index can be added at the end of the array. Avoid changing the meaning of existing indexes unless the `saveVersion` is updated.

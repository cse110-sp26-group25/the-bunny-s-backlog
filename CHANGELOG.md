# Changelog

## Changes

### June 6, 2026

#### Fixed

- Fixed level select progress display by loading shared helpers from `local_storage.js` and using saved unlock/completion state.
- Fixed level select id mismatches by separating each level's saved progress id from its game-loader folder.
- Fixed the credits back button to use a relative title-screen path.
- Fixed settings screen startup so old or malformed saved settings cannot break sliders, percentage labels, or navigation.
- Fixed settings sliders so the fill line updates immediately while dragging.

#### Changed

- Added global application of saved settings across screens that load `local_storage.js`.
- Added shared volume application for current and future audio/video elements using master, music, and effects volume settings.
- Added shared hard-mode page state through the `hard-mode` body class and `data-hard-mode` document attribute.
- Added saved music-volume application to title, settings, level select, credits, and in-level background music.
- Changed settings controls to preview changes immediately but save only when the player clicks Apply.

### June 4, 2026

- Implemented `LevelStorage` in `src/engine/storage.js` for the refactored game flow.
- Added current-level read/write support under per-level localStorage keys.
- Linked completed `LevelStorage` saves to `markLevelComplete(levelId)` so level-select progress updates through `local_storage.js`.
- Added tutorial progress persistence for `tutorial_morning_routine`, including phase, inventory, unlocked object state, error count, completion status, and terminal history.
- Removed unused tutorial-specific helper functions from `local_storage.js`; current-level resume progress is now handled by `LevelStorage`.
- Updated `LocalStorage.md` to document the shared save array and the separate `LevelStorage` current-level layer.
- Added Jest coverage for `LevelStorage` saving, loading, clearing, corrupted saves, and preserving settings.

### Initial Local Storage Setup

- Added local storage helper functions for saving, loading, and clearing save data.
- Added a documented save data index structure.
- Added support for tracking level progress, checkpoints, inventory, clues found, object states, notebook pages, terminal history, settings, and tutorial completion.
- Added documentation explaining what each local storage index represents.

## June 6, 2026

### Fixed

- Fixed a level loading issue where the game always attempted to load `tutorial.json` regardless of the selected level.
- Updated the level loader to dynamically load the correct JSON file based on the selected level folder.
- Verified tutorial and level loading behavior using the local development server.

### Testing

- Tested level loading through `src/game.html`.
- Confirmed tutorial level loads without HTTP 404 errors.
- Reviewed level selection routing and level folder configuration.

### June 7, 2026

### Fixed

- Title Screen (Mobile): Fixed button labels (Level selection, Continue game, Settings) overflowing their boxes by scaling the font down on narrow screens.
- Level Selection Screen (Mobile): Layout now stacks vertically and the page scrolls, so Tutorial / Level 1 / Level 2 are all reachable (previously the cards were pushed off-screen).
- Settings Screen (Mobile): Hard Mode toggle is now a proper wide pill instead of a pinched vertical strip, and the Back to Title button is no longer cut off below the panel.

### Note

- The 3 mobile UI screen fixes mentioned above only applies specificaly when playing the game with a vertical orientation, and not when playing the game with a horizontal orientation. (Granted the presumption that the majority, if not all, of players will intuitively play with a vertical orientation, for clarification purposes, we felt this should be noted/documented.

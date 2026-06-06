# Bugs

Use this file to track bugs found during testing. Once a bug is fixed, move the
fix summary to `CHANGELOG.md`.

## Gameplay and Engine

Focus areas:
- `src/game.html`
- `src/main.js`
- `src/engine/`
- `src/components/`
- `src/levels/`
- `level_001.js`
- `solve_terminal.js`
- `local_storage.js`

Test goals:
- Game loads without console errors.
- Tutorial flow works from start to finish.
- Valid terminal commands are accepted.
- Invalid terminal commands show useful errors.
- Hotspots and interactables respond correctly.
- Evidence and checklist state update correctly.
- Level transitions work.
- Refreshing the page preserves expected progress.
- Reset or new game behavior clears expected progress.

## Screens, UI, and Navigation

Focus areas:
- `Screens/titleScreen/`
- `Screens/settings/`
- `Screens/credits/`
- `Screens/level_screen/`
- `src/styles/`
- `index.html`
- `engine-and-deployment/mobdeskdet.html`

Test goals:
- Title screen buttons navigate correctly.
- Settings controls work and persist if expected.
- Credits page displays correctly.
- Level select page works.
- Pages remain usable on smaller screens.
- Images, sounds, and paths load correctly.
- Back and home navigation work.
- No broken links or missing assets.
- No layout overlap or unreadable text.

## Bug List

### Level select progress is hardcoded instead of using saved progress

Area: Level Select / Storage
Severity: Medium
Status: Fixed

Notes:
- `Screens/level_screen/script.js` hardcodes tutorial as `completed: true`.
- Fixed by loading `local_storage.js` and using `isLevelUnlocked()` / `isLevelComplete()` for card status.

### Level select ids do not match shared progress ids

Area: Level Select / Storage
Severity: Medium
Status: Fixed

Notes:
- `Screens/level_screen/script.js` uses ids like `tutorial`, `level1`, and `level2`.
- `local_storage.js` uses ids like `tutorial_morning_routine`, `level_001`, and `level_002`.
- This mismatch can prevent level select progress, unlocks, and completion state from matching the actual saved data.
- Fixed by separating each level's saved progress id from its game loader folder.


### Credits back button uses an absolute path

Area: Credits / Navigation
Severity: Low
Status: Fixed

Notes:
- `Screens/credits/creditsFunctions.js` sends the back button to `/Screens/titleScreen/title.html`.
- That works only when the site is served from the domain root.
- If the project is hosted under a subpath, such as GitHub Pages project hosting, the absolute path can navigate to the wrong location.
- Other screens use relative paths like `../titleScreen/title.html`.
- Fixed by changing the credits back button to `../titleScreen/title.html`.

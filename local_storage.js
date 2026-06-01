// ---------------------------------------------------------
// Local Storage System for The Bunny's Backlog
// ---------------------------------------------------------
// This file handles saving, loading, and clearing player data.
// The data is stored in the browser using localStorage.
// Since localStorage only stores strings, the save array is
// converted into a JSON string when saving, then parsed back
// into an array when loading.
// ---------------------------------------------------------

// name/key used to store the save data 
// must stay same everywhere in project
const SAVE_KEY = "bunnysBacklogSave";

function createDefaultSaveData() {
  return [
    1,                  // index 0: save version
    "tutorial_office",  // index 1: current level
    "start",            // index 2: current checkpoint
    [],                 // index 3: inventory
    {},                 // index 4: clues found
    {},                 // index 5: object states
    [],                 // index 6: unlocked notebook pages
    [],                 // index 7: terminal history
    {},                 // index 8: settings
    false               // index 9: tutorial completed
  ];
}

// ---------------------------------------------------------
// saveGame(saveData)
// ---------------------------------------------------------
// Saves the current game data into localStorage.
// The saveData array must be converted into a JSON string
// because localStorage cannot directly store arrays or objects.
// ---------------------------------------------------------
function saveGame(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

// ---------------------------------------------------------
// loadGame()
// ---------------------------------------------------------
// Loads the save data from localStorage.
// If no save file exists, it creates a new default save.
// ---------------------------------------------------------
function loadGame() {
  const savedString = localStorage.getItem(SAVE_KEY);

  // if no save data start new save file
  if (savedString === null) {
    return createDefaultSaveData();
  }
  
  // Convert saved JSON string back in array
  return JSON.parse(savedString);
}

// ---------------------------------------------------------
// clearSave()
// ---------------------------------------------------------
// Deletes the saved game data from localStorage.
// This can be used for a "New Game" or "Reset Save" button.
// ---------------------------------------------------------
function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
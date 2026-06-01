// ============================================================
// LEVEL DATA — Genesis Arc, Case 001
// This file contains all data and logic for level 1.
// Import this file into your ct.js room to use it.
// ============================================================

const level_genesis_001 = {

  level_id: "genesis_001", // Unique ID used by the scene manager to load the correct level

  // ----------------------------------------------------------
  // CLUES ARRAY
  // Each object is one discoverable piece of evidence.
  // When the player triggers a POI, the targetString is checked.
  // If it matches, isFound is set to true and the clue is added
  // to the Word Box.
  // ----------------------------------------------------------
  clues: [
    {
      targetString: "log.whoAccessed(server);", // Exact string the player must type to trigger this clue
      clue: "suspect = \"Phantom\"",            // What gets added to the Word Box on discovery
      isFound: false                            // Updated to true at runtime when player finds it
    },
    {
      targetString: "trace.getOrigin(packet);",
      clue: "breachedPort = 8080",
      isFound: false
    },
    {
      targetString: "scanner.parseData(keycard);",
      clue: "accessLevel = \"Admin\"",
      isFound: false
    }
  ],

  // ----------------------------------------------------------
  // TRUE STORY
  // The exact string the player must type in the solve terminal
  // to complete the level. Whitespace is ignored during comparison
  // so "func(a, b, c)" and "func(a,b,c)" both pass.
  // ----------------------------------------------------------
  true_story: "deployFirewall(\"Phantom\", 8080, \"Admin\");"

};

// ============================================================
// ACCURACY CHECKER
// Call this when the player submits their answer in the
// solve terminal. Returns true if the level is solved,
// false if the answer is wrong.
//
// Usage:
//   const passed = checkSolution(playerInput, level_genesis_001.true_story);
//   if (passed) { // advance to next level }
// ============================================================
function checkSolution(playerInput, trueStory) {
  // Remove all whitespace before comparing
  // so "func(a, b, c)" and "func(a,b,c)" are treated the same
  return playerInput.replace(/\s/g, '') === trueStory.replace(/\s/g, '');
}
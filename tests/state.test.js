/**
 * LocalStorage state serialization tests.
 * Uses an in-memory mock so no browser is required.
 */

const store = {};

global.localStorage = {
  getItem: (key) => (key in store ? store[key] : null),
  setItem: (key, value) => {
    store[key] = String(value);
  },
  removeItem: (key) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  }
};

const {
  SAVE_KEY,
  TUTORIAL_LEVEL_ID,
  LEVEL_IDS,
  createDefaultSettings,
  createDefaultLevelProgress,
  createDefaultSaveData,
  saveGame,
  loadGame,
  clearSave,
  loadSafeGame,
  loadSettings,
  saveSettingsData,
  loadLevelProgress,
  saveCurrentLevel,
  saveCheckpoint,
  unlockLevel,
  markLevelComplete,
  isLevelUnlocked,
  isLevelComplete,
  getNextLevelId
} = require('../local_storage');

beforeEach(() => localStorage.clear());

test('creates the documented default save data', () => {
  expect(createDefaultSaveData()).toEqual([
    1,
    TUTORIAL_LEVEL_ID,
    'start',
    [],
    {},
    {},
    [],
    [],
    {
      masterVolume: 80,
      musicVolume: 60,
      effectsVolume: 75,
      hardMode: false
    },
    false,
    createDefaultLevelProgress()
  ]);
});

test('loads default save data when no save exists', () => {
  expect(loadGame()).toEqual(createDefaultSaveData());
});

test('saves and reloads game state with the project save key', () => {
  const saveData = createDefaultSaveData();
  saveData[2] = 'found_hidden_key';
  saveData[3] = ['hidden_key', 'case_journal'];
  saveData[4] = { plant_key: true };
  saveData[5] = { desk_drawer: { locked: false, opened: true } };
  saveData[6] = ['objects', 'scope', 'methods'];
  saveData[7] = ['self.search(plantPot);', 'Success: You found a hidden key.'];
  saveData[8] = {
    masterVolume: 80,
    musicVolume: 60,
    effectsVolume: 75,
    hardMode: false
  };

  saveGame(saveData);

  expect(JSON.parse(localStorage.getItem(SAVE_KEY))).toEqual(saveData);
  expect(loadGame()).toEqual(saveData);
});

test('clears saved game state', () => {
  saveGame(createDefaultSaveData());

  clearSave();

  expect(localStorage.getItem(SAVE_KEY)).toBeNull();
});

test('throws SyntaxError on corrupted JSON', () => {
  localStorage.setItem(SAVE_KEY, '{bad json}');

  expect(() => loadGame()).toThrow(SyntaxError);
});

test('loads default settings from index 8', () => {
  expect(loadSettings()).toEqual(createDefaultSettings());
});

test('saves settings without overwriting other save data', () => {
  const saveData = createDefaultSaveData();
  saveData[1] = 'level2';
  saveGame(saveData);

  saveSettingsData({
    masterVolume: 25,
    musicVolume: 10,
    effectsVolume: 90,
    hardMode: true
  });

  expect(loadGame()[1]).toBe('level2');
  expect(loadSettings()).toEqual({
    masterVolume: 25,
    musicVolume: 10,
    effectsVolume: 90,
    hardMode: true
  });
});

test('loads default level progress from index 10', () => {
  expect(loadLevelProgress()).toEqual(createDefaultLevelProgress());
});

test('saves current level and checkpoint', () => {
  saveCurrentLevel(LEVEL_IDS.LEVEL_1);
  saveCheckpoint('found_first_clue');

  const saveData = loadGame();
  expect(saveData[1]).toBe(LEVEL_IDS.LEVEL_1);
  expect(saveData[2]).toBe('found_first_clue');
});

test('unlocks and completes levels in official order', () => {
  expect(isLevelUnlocked(LEVEL_IDS.LEVEL_2)).toBe(false);

  markLevelComplete(LEVEL_IDS.LEVEL_1);

  expect(isLevelComplete(LEVEL_IDS.LEVEL_1)).toBe(true);
  expect(isLevelUnlocked(LEVEL_IDS.LEVEL_2)).toBe(true);
  expect(getNextLevelId(LEVEL_IDS.LEVEL_1)).toBe(LEVEL_IDS.LEVEL_2);
});

test('can unlock a level without completing it', () => {
  unlockLevel(LEVEL_IDS.LEVEL_3);

  expect(isLevelUnlocked(LEVEL_IDS.LEVEL_3)).toBe(true);
  expect(isLevelComplete(LEVEL_IDS.LEVEL_3)).toBe(false);
});

test('loadSafeGame clears corrupted JSON and returns defaults', () => {
  localStorage.setItem(SAVE_KEY, '{bad json}');

  expect(loadSafeGame()).toEqual(createDefaultSaveData());
  expect(localStorage.getItem(SAVE_KEY)).toBeNull();
});


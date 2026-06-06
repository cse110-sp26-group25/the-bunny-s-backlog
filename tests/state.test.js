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
  normalizeSettings,
  createDefaultLevelProgress,
  createDefaultSaveData,
  saveGame,
  loadGame,
  clearSave,
  loadSafeGame,
  loadSettings,
  saveSettingsData,
  volumePercentToScale,
  applyGlobalSettings,
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

test('normalizes invalid saved settings without throwing', () => {
  expect(normalizeSettings({
    masterVolume: '200',
    musicVolume: 'bad',
    effectsVolume: -5,
    hardMode: 1
  })).toEqual({
    masterVolume: 100,
    musicVolume: 60,
    effectsVolume: 0,
    hardMode: true
  });
});

test('loads defaults from old malformed settings saves', () => {
  const saveData = createDefaultSaveData();
  saveData[8] = 'old bad settings';
  saveGame(saveData);

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

test('loads defaults when localStorage is unavailable', () => {
  const availableStorage = global.localStorage;
  delete global.localStorage;

  try {
    expect(loadGame()).toEqual(createDefaultSaveData());
    expect(loadSettings()).toEqual(createDefaultSettings());
  } finally {
    global.localStorage = availableStorage;
  }
});

test('keeps screens usable when localStorage writes throw', () => {
  const availableStorage = global.localStorage;
  global.localStorage = {
    getItem: () => null,
    setItem: () => {
      throw new Error('storage blocked');
    },
    removeItem: () => {
      throw new Error('storage blocked');
    }
  };

  try {
    expect(() => saveGame(createDefaultSaveData())).not.toThrow();
    expect(() => clearSave()).not.toThrow();
  } finally {
    global.localStorage = availableStorage;
  }
});

test('converts volume percentages into media volume scale', () => {
  expect(volumePercentToScale(80)).toBe(0.8);
  expect(volumePercentToScale('25')).toBe(0.25);
  expect(volumePercentToScale(-1)).toBe(0);
  expect(volumePercentToScale(150)).toBe(1);
  expect(volumePercentToScale('bad')).toBe(0);
});

test('applies global settings to document media elements', () => {
  const mediaElements = [
    { dataset: { volumeType: 'music' }, volume: 1, muted: false },
    { dataset: { volumeType: 'effects' }, volume: 1, muted: false },
    { dataset: {}, volume: 1, muted: false }
  ];
  const bodyClassList = { toggle: jest.fn() };
  const doc = {
    documentElement: {
      dataset: {},
      style: { setProperty: jest.fn() }
    },
    body: { classList: bodyClassList },
    querySelectorAll: jest.fn(() => mediaElements)
  };

  applyGlobalSettings(doc, {
    masterVolume: 50,
    musicVolume: 40,
    effectsVolume: 20,
    hardMode: true
  });

  expect(mediaElements[0].volume).toBe(0.2);
  expect(mediaElements[1].volume).toBe(0.1);
  expect(mediaElements[2].volume).toBe(0.5);
  expect(doc.documentElement.dataset.hardMode).toBe('true');
  expect(bodyClassList.toggle).toHaveBeenCalledWith('hard-mode', true);
});


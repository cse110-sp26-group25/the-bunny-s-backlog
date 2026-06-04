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
  createDefaultSettings,
  createDefaultSaveData,
  saveGame,
  loadGame,
  clearSave,
  loadSafeGame,
  loadSettings,
  saveSettingsData,
  createDefaultTutorialState,
  saveTutorialState,
  loadTutorialState,
  clearTutorialState,
  getTutorialNotebookPages
} = require('../local_storage');

beforeEach(() => localStorage.clear());

test('creates the documented default save data', () => {
  expect(createDefaultSaveData()).toEqual([
    1,
    'tutorial_office',
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
    false
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

test('loadSafeGame clears corrupted JSON and returns defaults', () => {
  localStorage.setItem(SAVE_KEY, '{bad json}');

  expect(loadSafeGame()).toEqual(createDefaultSaveData());
  expect(localStorage.getItem(SAVE_KEY)).toBeNull();
});

test('loads default tutorial state when no tutorial save exists', () => {
  expect(loadTutorialState()).toEqual(createDefaultTutorialState());
});

test('saves and reloads tutorial progress', () => {
  saveTutorialState({
    phase: 8,
    inventory: ['key'],
    drawerUnlocked: false,
    errors: 2,
    complete: false,
    terminalHistory: [
      { text: '> self.take("key");', cls: 'cmd' },
      { text: '[Item Acquired: Silver Key]', cls: 'ok' }
    ]
  });

  const saveData = loadGame();
  expect(saveData[1]).toBe(TUTORIAL_LEVEL_ID);
  expect(saveData[2]).toBe('phase_8');
  expect(saveData[3]).toEqual(['key']);
  expect(saveData[5][TUTORIAL_LEVEL_ID]).toEqual({
    drawerUnlocked: false,
    errors: 2,
    complete: false
  });
  expect(saveData[6]).toEqual(getTutorialNotebookPages(8, false));
  expect(saveData[7]).toEqual([
    { text: '> self.take("key");', cls: 'cmd' },
    { text: '[Item Acquired: Silver Key]', cls: 'ok' }
  ]);
  expect(saveData[9]).toBe(false);
  expect(loadTutorialState()).toEqual({
    phase: 8,
    inventory: ['key'],
    drawerUnlocked: false,
    errors: 2,
    complete: false,
    terminalHistory: [
      { text: '> self.take("key");', cls: 'cmd' },
      { text: '[Item Acquired: Silver Key]', cls: 'ok' }
    ]
  });
});

test('saves completed tutorial state', () => {
  saveTutorialState({
    phase: 11,
    inventory: ['key'],
    drawerUnlocked: true,
    errors: 1,
    complete: true,
    terminalHistory: []
  });

  const saveData = loadGame();
  expect(saveData[2]).toBe('phase_11');
  expect(saveData[6]).toEqual(getTutorialNotebookPages(11, true));
  expect(saveData[9]).toBe(true);
  expect(loadTutorialState().complete).toBe(true);
});

test('clears tutorial state without deleting settings', () => {
  saveSettingsData({
    masterVolume: 20,
    musicVolume: 30,
    effectsVolume: 40,
    hardMode: true
  });
  saveTutorialState({
    phase: 7,
    inventory: ['key'],
    drawerUnlocked: false,
    errors: 3,
    complete: false,
    terminalHistory: [{ text: '> inspect("plant");', cls: 'cmd' }]
  });

  clearTutorialState();

  expect(loadTutorialState()).toEqual(createDefaultTutorialState());
  expect(loadSettings()).toEqual({
    masterVolume: 20,
    musicVolume: 30,
    effectsVolume: 40,
    hardMode: true
  });
});

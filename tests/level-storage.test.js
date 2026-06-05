const { LevelStorage } = require("../src/engine/storage");
const {
  SAVE_KEY,
  LEVEL_IDS,
  isLevelComplete,
  isLevelUnlocked,
  loadSettings,
  markLevelComplete,
  saveSettingsData,
} = require("../local_storage");

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
  },
};

const LEVEL_ID = "tutorial_morning_routine";

let levelStorage;

beforeEach(() => {
  localStorage.clear();
  levelStorage = new LevelStorage(localStorage, { markLevelComplete });
});

test("loads null when no level save exists", () => {
  expect(levelStorage.load(LEVEL_ID)).toBeNull();
});

test("saves and loads current level progress by level id", () => {
  levelStorage.save(LEVEL_ID, {
    phase: 8,
    inventory: ["key"],
    unlocked: { drawers: true },
    errors: 2,
    complete: false,
    terminalHistory: [
      { text: '> self.take("key");', cls: "cmd" },
      { text: "[Item Acquired: Silver Key]", cls: "ok" },
    ],
  });

  expect(levelStorage.load(LEVEL_ID)).toEqual({
    phase: 8,
    inventory: ["key"],
    unlocked: { drawers: true },
    errors: 2,
    complete: false,
    terminalHistory: [
      { text: '> self.take("key");', cls: "cmd" },
      { text: "[Item Acquired: Silver Key]", cls: "ok" },
    ],
  });
});

test("clears only the requested level save", () => {
  levelStorage.save(LEVEL_ID, {
    phase: 3,
    inventory: [],
    unlocked: {},
    errors: 0,
    complete: false,
    terminalHistory: [],
  });
  levelStorage.save("level_001", {
    phase: 2,
    inventory: ["journal"],
    unlocked: {},
    errors: 1,
    complete: false,
    terminalHistory: [],
  });

  levelStorage.clear(LEVEL_ID);

  expect(levelStorage.load(LEVEL_ID)).toBeNull();
  expect(levelStorage.load("level_001").phase).toBe(2);
});

test("does not overwrite local_storage.js settings data", () => {
  saveSettingsData({
    masterVolume: 20,
    musicVolume: 30,
    effectsVolume: 40,
    hardMode: true,
  });

  levelStorage.save(LEVEL_ID, {
    phase: 6,
    inventory: ["key"],
    unlocked: {},
    errors: 1,
    complete: false,
    terminalHistory: [{ text: '> inspect("plant");', cls: "cmd" }],
  });

  expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
  expect(loadSettings()).toEqual({
    masterVolume: 20,
    musicVolume: 30,
    effectsVolume: 40,
    hardMode: true,
  });
});

test("does not update level-select progress for incomplete saves", () => {
  levelStorage.save(LEVEL_ID, {
    phase: 6,
    inventory: ["key"],
    unlocked: {},
    errors: 1,
    complete: false,
    terminalHistory: [],
  });

  expect(isLevelComplete(LEVEL_ID)).toBe(false);
});

test("marks level-select progress complete when level is complete", () => {
  levelStorage.save(LEVEL_ID, {
    phase: 11,
    inventory: ["key"],
    unlocked: { drawers: true },
    errors: 1,
    complete: true,
    terminalHistory: [],
  });

  expect(isLevelComplete(LEVEL_ID)).toBe(true);
  expect(isLevelUnlocked(LEVEL_IDS.LEVEL_1)).toBe(true);
});

test("clears corrupted JSON and returns null", () => {
  localStorage.setItem(LevelStorage.keyFor(LEVEL_ID), "{bad json}");

  expect(levelStorage.load(LEVEL_ID)).toBeNull();
  expect(localStorage.getItem(LevelStorage.keyFor(LEVEL_ID))).toBeNull();
});

test("normalizes partial or malformed saved state", () => {
  localStorage.setItem(
    LevelStorage.keyFor(LEVEL_ID),
    JSON.stringify({
      phase: "4",
      inventory: "key",
      unlocked: "drawers",
      errors: "not-a-number",
      complete: 1,
      terminalHistory: [{ text: "> scan", cls: "cmd" }, null, "bad"],
    }),
  );

  expect(levelStorage.load(LEVEL_ID)).toEqual({
    phase: 4,
    inventory: [],
    unlocked: {},
    errors: 0,
    complete: true,
    terminalHistory: [{ text: "> scan", cls: "cmd" }],
  });
});

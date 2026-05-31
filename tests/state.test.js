/**
 * LocalStorage state serialization tests.
 * Uses an in-memory mock — no browser required.
 */

const store = {};
const ls = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  clear:   ()     => { Object.keys(store).forEach(k => delete store[k]); },
};

beforeEach(() => ls.clear());

test('saves and reloads game state correctly', () => {
  const state = { hp: 100, inventory: ['key'], unlockedPages: [1, 2] };
  ls.setItem('gameState', JSON.stringify(state));
  expect(JSON.parse(ls.getItem('gameState'))).toEqual(state);
});

test('returns null when no state is saved', () => {
  expect(ls.getItem('gameState')).toBeNull();
});

test('throws SyntaxError on corrupted JSON — must be caught explicitly', () => {
  ls.setItem('gameState', '{bad json}');
  expect(() => JSON.parse(ls.getItem('gameState'))).toThrow(SyntaxError);
});

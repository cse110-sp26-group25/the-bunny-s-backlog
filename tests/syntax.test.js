/**
 * Typing syntax validation tests.
 * Verifies OOP-style commands (e.g. self.search();) are parsed correctly.
 */

function validateCommand(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    return { valid: false, error: 'Input must be a non-empty string' };
  }
  if (!input.endsWith(';')) {
    return { valid: false, error: 'Missing trailing semicolon' };
  }
  // Must match: identifier.method(optional args);
  if (!/^[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)?\(.*\);$/.test(input)) {
    return { valid: false, error: 'Invalid syntax structure' };
  }
  return { valid: true };
}

test('accepts a valid scoped method call', () => {
  expect(validateCommand('self.search();')).toEqual({ valid: true });
});

test('accepts a valid method call with a parameter', () => {
  expect(validateCommand('self.open(door);')).toEqual({ valid: true });
});

test('rejects input missing a trailing semicolon', () => {
  const result = validateCommand('self.search()');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Missing trailing semicolon');
});

test('rejects plain text with no method structure', () => {
  const result = validateCommand('hello;');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Invalid syntax structure');
});

test('rejects empty input', () => {
  const result = validateCommand('');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Input must be a non-empty string');
});

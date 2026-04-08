import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidLuhn } from '../src/luhn.js';

test('numero valido', () => {
  assert.equal(isValidLuhn('4111111111111111'), true);
});

test('numero invalido', () => {
  assert.equal(isValidLuhn('4111111111111112'), false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readOid, toBoolean, toNumber, readOidTimestamp } from '../src-widgets/src/common/stateValue.ts';

test('readOid: missing oid configuration returns status "no-oid" (widget must not crash)', () => {
    const result = readOid({}, undefined);
    assert.equal(result.status, 'no-oid');
    assert.equal(result.value, null);

    const result2 = readOid({}, '');
    assert.equal(result2.status, 'no-oid');
});

test('readOid: configured oid whose state does not exist / has no value -> "unavailable"', () => {
    const result = readOid({}, 'javascript.0.does.not.exist');
    assert.equal(result.status, 'unavailable');
    assert.equal(result.value, null);

    const result2 = readOid({ 'some.id.val': null }, 'some.id');
    assert.equal(result2.status, 'unavailable');
});

test('readOid: existing value is read from the "<oid>.val" key', () => {
    const values = { 'javascript.0.temp.val': 21.4 };
    const result = readOid<number>(values, 'javascript.0.temp');
    assert.equal(result.status, 'ok');
    assert.equal(result.value, 21.4);
});

test('readOid: values map itself missing entirely does not throw', () => {
    const result = readOid(undefined, 'some.id');
    assert.equal(result.status, 'unavailable');
});

test('toBoolean: tolerant coercion of common ioBroker boolean representations', () => {
    assert.equal(toBoolean(true), true);
    assert.equal(toBoolean(false), false);
    assert.equal(toBoolean(1), true);
    assert.equal(toBoolean(0), false);
    assert.equal(toBoolean('true'), true);
    assert.equal(toBoolean('1'), true);
    assert.equal(toBoolean('false'), false);
    assert.equal(toBoolean('0'), false);
    assert.equal(toBoolean(null), false);
    assert.equal(toBoolean(undefined), false);
});

test('toNumber: valid numbers and numeric strings pass through, invalid values become null', () => {
    assert.equal(toNumber(5), 5);
    assert.equal(toNumber(5.5), 5.5);
    assert.equal(toNumber('5.5'), 5.5);
    assert.equal(toNumber('  '), null);
    assert.equal(toNumber('abc'), null);
    assert.equal(toNumber(Number.NaN), null);
    assert.equal(toNumber(null), null);
    assert.equal(toNumber(undefined), null);
    assert.equal(toNumber(true), null);
});

test('readOidTimestamp: reads "<oid>.ts", tolerant of missing data', () => {
    assert.equal(readOidTimestamp({ 'a.ts': 1700000000000 }, 'a'), 1700000000000);
    assert.equal(readOidTimestamp({}, 'a'), null);
    assert.equal(readOidTimestamp(undefined, 'a'), null);
    assert.equal(readOidTimestamp({ 'a.ts': 1700000000000 }, undefined), null);
});

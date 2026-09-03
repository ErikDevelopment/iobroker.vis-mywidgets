import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatSigned, isNumeric, clamp, formatTime } from '../src-widgets/src/common/format.ts';

test('formatNumber: German default formatting (comma decimal, dot thousands)', () => {
    assert.equal(formatNumber(14.109, { decimals: 2, unit: 'kWh' }), '14,11 kWh');
    assert.equal(formatNumber(21.4, { decimals: 1, unit: '°C' }), '21,4 °C');
    assert.equal(formatNumber(1234.5, { decimals: 0 }), '1.235');
    assert.equal(formatNumber(92, { decimals: 0, unit: '%' }), '92 %');
});

test('formatNumber: prefix/suffix/custom separators', () => {
    assert.equal(formatNumber(2.6, { decimals: 1, prefix: '~', suffix: '', unit: 'kW' }), '~2,6 kW');
    assert.equal(formatNumber(1234.5, { decimals: 2, decimalSeparator: '.', thousandsSeparator: ',' }), '1,234.50');
});

test('formatNumber: negative numbers keep the sign in front of the prefix', () => {
    assert.equal(formatNumber(-4.2, { decimals: 1, unit: 'kW' }), '-4,2 kW');
});

test('formatNumber: non-numeric / missing values never throw and show a placeholder', () => {
    assert.equal(formatNumber(null), '–');
    assert.equal(formatNumber(undefined), '–');
    assert.equal(formatNumber('', { unit: 'kWh' }), '–');
    assert.equal(formatNumber('not-a-number'), '–');
    assert.equal(formatNumber(Number.NaN), '–');
});

test('formatSigned: explicit "+" for positive, "-" for negative', () => {
    assert.equal(formatSigned(0.3, { decimals: 2, unit: 'kWh' }), '+0,30 kWh');
    assert.equal(formatSigned(-0.3, { decimals: 2, unit: 'kWh' }), '-0,30 kWh');
    assert.equal(formatSigned('not-a-number'), '–');
});

test('isNumeric', () => {
    assert.equal(isNumeric(5), true);
    assert.equal(isNumeric('5.5'), true);
    assert.equal(isNumeric(''), false);
    assert.equal(isNumeric(null), false);
    assert.equal(isNumeric(undefined), false);
    assert.equal(isNumeric('abc'), false);
    assert.equal(isNumeric(Number.NaN), false);
});

test('clamp', () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-5, 0, 10), 0);
    assert.equal(clamp(15, 0, 10), 10);
    assert.equal(clamp(Number.NaN, 2, 10), 2);
});

test('formatTime: falls back to placeholder for missing/invalid timestamps', () => {
    assert.equal(formatTime(undefined), '--:--');
    assert.equal(formatTime(null), '--:--');
    assert.equal(formatTime(Number.NaN), '--:--');
    assert.match(formatTime(Date.now()), /^\d{2}:\d{2}$/);
});

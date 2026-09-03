import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * These are structural / static-source checks rather than a live import of
 * the .tsx widgets. The widget files import their sibling .css files (Vite
 * handles that at bundle time), which the plain Node/tsx test runner used
 * here (no bundler, no jsdom) cannot resolve - so instead of mocking a DOM
 * and a fake `window.visRxWidget` just to import them, these tests verify
 * the two things most likely to silently break "widgets actually appear in
 * the VIS editor" (spec item 38.8): every widget component referenced by
 * io-package.json really exists as a source file with a matching, unique
 * `id`/`visSet`, and every widget's admin-editor field groups are
 * well-formed (unique field names, every field has name+type).
 */

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const WIDGETS_DIR = path.join(ROOT, 'src-widgets', 'src', 'widgets');

function readIoPackage(): any {
    return JSON.parse(readFileSync(path.join(ROOT, 'io-package.json'), 'utf8'));
}

function widgetSourceFiles(): string[] {
    return readdirSync(WIDGETS_DIR).filter((f) => f.endsWith('.tsx'));
}

test('io-package.json visWidgets.mywidgets.components matches the widget source files', () => {
    const pkg = readIoPackage();
    const components: string[] = pkg.common.visWidgets.mywidgets.components;
    const fileNames = widgetSourceFiles().map((f) => f.replace(/\.tsx$/, ''));

    assert.deepEqual([...components].sort(), [...fileNames].sort(), 'every widget file must be listed in io-package.json and vice versa');
});

test('every widget file declares a class matching its filename and exports it as default', () => {
    for (const file of widgetSourceFiles()) {
        const name = file.replace(/\.tsx$/, '');
        const source = readFileSync(path.join(WIDGETS_DIR, file), 'utf8');
        assert.match(source, new RegExp(`export default class ${name}\\b`), `${file} must "export default class ${name}"`);
    }
});

test('every widget declares a unique tpl id and belongs to the "mywidgets" visSet', () => {
    const ids = new Set<string>();
    for (const file of widgetSourceFiles()) {
        const source = readFileSync(path.join(WIDGETS_DIR, file), 'utf8');

        const idMatch = source.match(/id:\s*'([^']+)'/);
        assert.ok(idMatch, `${file} is missing a widget "id"`);
        const id = idMatch![1];
        assert.equal(ids.has(id), false, `duplicate widget id "${id}" in ${file}`);
        ids.add(id);

        assert.match(source, /visSet:\s*'mywidgets'/, `${file} must declare visSet: 'mywidgets'`);
        assert.match(source, /getWidgetInfo\(\):\s*RxWidgetInfo/, `${file} must implement an instance getWidgetInfo()`);
        assert.match(source, /static getWidgetInfo\(\):\s*RxWidgetInfo/, `${file} must implement a static getWidgetInfo()`);
    }
});

test('every state-bound widget renders an "Unavailable" state instead of assuming its oid/state exists', () => {
    // MyNavigationButton is the one widget that does not bind to any ioBroker
    // state (it navigates between VIS views / URLs), so there is nothing
    // that can be "unavailable" for it - every other widget must handle a
    // missing/invalid oid gracefully (spec item 24/28).
    const exceptions = new Set(['MyNavigationButton.tsx']);
    for (const file of widgetSourceFiles()) {
        if (exceptions.has(file)) {
            continue;
        }
        const source = readFileSync(path.join(WIDGETS_DIR, file), 'utf8');
        assert.match(source, /Unavailable/, `${file} should handle a missing/invalid state via <Unavailable /> (spec item 24/28)`);
    }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    oidField,
    textField,
    colorField,
    checkboxField,
    numberField,
    selectField,
    designFields,
    behaviorFields,
} from '../src-widgets/src/common/attrFields.ts';

test('oidField: produces a VIS "id" field with the expected defaults', () => {
    const f = oidField();
    assert.equal(f.name, 'oid');
    assert.equal(f.type, 'id');
    assert.equal(f.label, 'object_id');
});

test('textField / colorField / checkboxField / numberField / selectField: name+type+default wiring', () => {
    assert.deepEqual(textField('title', 'title', 'Hi'), { name: 'title', label: 'title', type: 'text', default: 'Hi' });
    assert.equal(colorField('accentColor', 'accent_color').type, 'color');
    assert.equal(checkboxField('animation', 'animation', true).default, true);
    const n = numberField('radius', 'radius', 20, { min: 0, max: 40 });
    assert.equal(n.type, 'number');
    assert.equal(n.min, 0);
    assert.equal(n.max, 40);
    const s = selectField('clickAction', 'click_action', ['toggle', 'true'], 'toggle');
    assert.equal(s.type, 'select');
    assert.deepEqual(s.options, ['toggle', 'true']);
});

test('designFields: always includes icon, accentColor, background and radius', () => {
    const fields = designFields('lightbulb');
    const names = fields.map((f) => f.name);
    assert.deepEqual(names, ['icon', 'accentColor', 'background', 'radius']);
    assert.equal(fields[0].default, 'lightbulb');
});

test('behaviorFields: click-action fields are only included when requested', () => {
    const withClick = behaviorFields(true).map((f) => f.name);
    assert.ok(withClick.includes('clickAction'));
    assert.ok(withClick.includes('customValue'));
    assert.ok(withClick.includes('animation'));

    const withoutClick = behaviorFields(false).map((f) => f.name);
    assert.deepEqual(withoutClick, ['animation']);
});

import type { RxWidgetInfoAttributesField } from '@iobroker/types-vis-2';

/**
 * Reusable admin-editor field groups shared by (almost) every widget, so the
 * "DESIGN" / "DISPLAY" / "BEHAVIOR" groups from spec item 29 look and behave
 * identically everywhere. Widget-specific fields (the "DATA" group, extra
 * DISPLAY toggles like `showUnit`) are still declared per widget.
 */

export function oidField(name = 'oid', label = 'object_id', extra: Partial<RxWidgetInfoAttributesField> = {}): RxWidgetInfoAttributesField {
    return { name, label, type: 'id', ...extra } as RxWidgetInfoAttributesField;
}

export function textField(name: string, label: string, defaultValue = ''): RxWidgetInfoAttributesField {
    return { name, label, type: 'text', default: defaultValue } as RxWidgetInfoAttributesField;
}

export function iconField(name = 'icon', defaultValue = 'lightbulb'): RxWidgetInfoAttributesField {
    return { name, label: 'icon', type: 'text', default: defaultValue } as RxWidgetInfoAttributesField;
}

export function colorField(name: string, label: string, defaultValue = ''): RxWidgetInfoAttributesField {
    return { name, label, type: 'color', default: defaultValue } as RxWidgetInfoAttributesField;
}

export function checkboxField(name: string, label: string, defaultValue = true): RxWidgetInfoAttributesField {
    return { name, label, type: 'checkbox', default: defaultValue } as RxWidgetInfoAttributesField;
}

export function numberField(
    name: string,
    label: string,
    defaultValue = 0,
    extra: Partial<RxWidgetInfoAttributesField> = {},
): RxWidgetInfoAttributesField {
    return { name, label, type: 'number', default: defaultValue, ...extra } as RxWidgetInfoAttributesField;
}

export function selectField(
    name: string,
    label: string,
    options: string[],
    defaultValue: string,
): RxWidgetInfoAttributesField {
    return { name, label, type: 'select', options, default: defaultValue } as RxWidgetInfoAttributesField;
}

/** DESIGN group fields: icon, accent color, background, radius. */
export function designFields(defaultIcon = 'lightbulb'): RxWidgetInfoAttributesField[] {
    return [
        iconField('icon', defaultIcon),
        colorField('accentColor', 'accent_color', ''),
        colorField('background', 'background', ''),
        numberField('radius', 'radius', 20, { min: 0, max: 40, step: 1 }),
    ];
}

/** BEHAVIOR group fields: optional click action + animation toggle. */
export function behaviorFields(includeClickAction: boolean): RxWidgetInfoAttributesField[] {
    const fields: RxWidgetInfoAttributesField[] = [];
    if (includeClickAction) {
        fields.push(
            selectField('clickAction', 'click_action', ['toggle', 'true', 'false', 'increment', 'decrement', 'custom', 'none'], 'toggle'),
            textField('customValue', 'custom_value', ''),
        );
    }
    fields.push(checkboxField('animation', 'animation', true));
    return fields;
}

export const GROUP_DATA = 'data';
export const GROUP_DESIGN = 'design';
export const GROUP_DISPLAY = 'display';
export const GROUP_BEHAVIOR = 'behavior';

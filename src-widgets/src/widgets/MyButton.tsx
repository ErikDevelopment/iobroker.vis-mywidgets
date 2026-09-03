import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo } from '@iobroker/types-vis-2';
import type { VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { toBoolean, toNumber } from '../common/stateValue';
import { designFields, behaviorFields, checkboxField, numberField, textField, GROUP_DATA, GROUP_DESIGN, GROUP_DISPLAY, GROUP_BEHAVIOR } from '../common/attrFields';
import './MyButton.css';

export type ClickAction = 'toggle' | 'true' | 'false' | 'increment' | 'decrement' | 'custom' | 'none';

export interface MyButtonRxData {
    oid: string;
    title: string;
    subtitle: string;
    icon: string;
    iconSize: number;
    fontSize: number;
    accentColor: string;
    background: string;
    radius: number;
    showStatus: boolean;
    clickAction: ClickAction;
    customValue: string;
    animation: boolean;
}

interface MyButtonState extends VisRxWidgetState {
    pressed?: boolean;
}

export default class MyButton extends MyWidgetBase<MyButtonRxData, MyButtonState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyButton',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Button',
            visWidgetLabel: 'mywidgets_button',
            visPrev: 'mywidgets/img/preview-button.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        { name: 'oid', label: 'object_id', type: 'id' },
                        textField('title', 'title', 'Wohnzimmer'),
                        textField('subtitle', 'subtitle', 'Licht'),
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: [
                        ...designFields('lightbulb'),
                        numberField('iconSize', 'icon_size', 32, { min: 16, max: 96, step: 2 }),
                        numberField('fontSize', 'font_size', 15, { min: 10, max: 32, step: 1 }),
                    ],
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [checkboxField('showStatus', 'show_status', true)],
                },
                {
                    name: GROUP_BEHAVIOR,
                    fields: behaviorFields(true),
                },
            ],
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return MyButton.getWidgetInfo();
    }

    private handleActivate = (): void => {
        const { rxData } = this.state;
        const action = rxData.clickAction || 'toggle';
        if (action === 'none' || !rxData.oid) {
            return;
        }

        const current = this.readField<unknown>('oid');

        switch (action) {
            case 'toggle':
                this.writeField('oid', !toBoolean(current.value));
                break;
            case 'true':
                this.writeField('oid', true);
                break;
            case 'false':
                this.writeField('oid', false);
                break;
            case 'increment':
                this.writeField('oid', (toNumber(current.value) ?? 0) + 1);
                break;
            case 'decrement':
                this.writeField('oid', (toNumber(current.value) ?? 0) - 1);
                break;
            case 'custom': {
                const raw = rxData.customValue;
                if (raw === 'true' || raw === 'false') {
                    this.writeField('oid', raw === 'true');
                } else if (raw !== '' && !Number.isNaN(Number(raw))) {
                    this.writeField('oid', Number(raw));
                } else {
                    this.writeField('oid', raw);
                }
                break;
            }
            default:
                break;
        }
    };

    private setPressed(pressed: boolean): void {
        if (this.state.rxData.animation === false) {
            return;
        }
        this.setState({ pressed });
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const { status, value } = this.readField<unknown>('oid');
        const isOn = toBoolean(value);
        const radius = rxData.radius ?? 20;

        if (status === 'no-oid') {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const cardStyle: React.CSSProperties = {
            borderRadius: radius,
            background: rxData.background || undefined,
        };

        const cls = [
            'mw-card',
            'mw-card--interactive',
            'mw-button',
            this.state.pressed ? 'mw-button--pressed' : '',
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div
                    className={cls}
                    style={cardStyle}
                    onPointerDown={() => this.setPressed(true)}
                    onPointerUp={() => this.setPressed(false)}
                    onPointerLeave={() => this.setPressed(false)}
                    onClick={this.handleActivate}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            this.handleActivate();
                        }
                    }}
                >
                    <div className="mw-button__icon" style={{ width: rxData.iconSize || 32, height: rxData.iconSize || 32 }}>
                        <Icon
                            name={(rxData.icon as IconName) || 'lightbulb'}
                            active={isOn}
                            style={isOn && rxData.accentColor ? { color: rxData.accentColor } : undefined}
                        />
                    </div>
                    <div className="mw-button__title" style={{ fontSize: rxData.fontSize || 15 }}>
                        {rxData.title}
                    </div>
                    {rxData.subtitle ? <div className="mw-button__subtitle">{rxData.subtitle}</div> : null}
                    {rxData.showStatus !== false && status === 'ok' && (
                        <span className={`mw-status-dot ${isOn ? 'mw-status-dot--on' : ''}`} style={{ marginTop: 8 }} />
                    )}
                </div>
            </div>
        );
    }
}

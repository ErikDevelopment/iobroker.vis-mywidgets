import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { toBoolean } from '../common/stateValue';
import { designFields, checkboxField, textField, GROUP_DATA, GROUP_DESIGN, GROUP_BEHAVIOR } from '../common/attrFields';
import './MyToggle.css';

export interface MyToggleRxData {
    oid: string;
    title: string;
    subtitle: string;
    icon: string;
    accentColor: string;
    background: string;
    radius: number;
    animation: boolean;
}

export default class MyToggle extends MyWidgetBase<MyToggleRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyToggle',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Toggle',
            visWidgetLabel: 'mywidgets_toggle',
            visPrev: 'mywidgets/img/preview-toggle.png',
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
                    fields: designFields('lightbulb'),
                },
                {
                    name: GROUP_BEHAVIOR,
                    fields: [checkboxField('animation', 'animation', true)],
                },
            ],
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return MyToggle.getWidgetInfo();
    }

    private handleToggle = (): void => {
        const { value } = this.readField<unknown>('oid');
        this.writeField('oid', !toBoolean(value));
    };

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

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div
                    className="mw-card mw-card--interactive mw-toggle"
                    style={{ borderRadius: radius, background: rxData.background || undefined }}
                    onClick={this.handleToggle}
                    role="switch"
                    aria-checked={isOn}
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') this.handleToggle();
                    }}
                >
                    <Icon name={(rxData.icon as IconName) || 'lightbulb'} active={isOn} style={isOn && rxData.accentColor ? { color: rxData.accentColor } : undefined} />
                    <div className="mw-toggle__labels">
                        <div className="mw-card__title">{rxData.title}</div>
                        {rxData.subtitle ? <div className="mw-card__subtitle">{rxData.subtitle}</div> : null}
                    </div>
                    {status === 'ok' ? (
                        <span className={`mw-switch ${isOn ? 'mw-switch--on' : ''}`}>
                            <span className="mw-switch__thumb" />
                        </span>
                    ) : (
                        <span className="mw-status-dot" />
                    )}
                </div>
            </div>
        );
    }
}

import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { formatNumber, isNumeric } from '../common/format';
import {
    designFields,
    checkboxField,
    numberField,
    textField,
    GROUP_DATA,
    GROUP_DESIGN,
    GROUP_DISPLAY,
    GROUP_BEHAVIOR,
} from '../common/attrFields';
import './MyValueCard.css';

export interface MyValueCardRxData {
    oid: string;
    title: string;
    subtitle: string;
    icon: string;
    accentColor: string;
    background: string;
    radius: number;
    unit: string;
    decimals: number;
    prefix: string;
    suffix: string;
    showIcon: boolean;
    showStatus: boolean;
    showUnit: boolean;
    animation: boolean;
}

export default class MyValueCard extends MyWidgetBase<MyValueCardRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyValueCard',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'widgets/mywidgets/img/mywidgets.svg',
            visName: 'Value Card',
            visWidgetLabel: 'mywidgets_value_card',
            visPrev: 'widgets/mywidgets/img/preview-value-card.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        { name: 'oid', label: 'object_id', type: 'id' },
                        textField('title', 'title', 'Temperatur'),
                        textField('subtitle', 'subtitle', 'Wohnzimmer'),
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: designFields('thermometer'),
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [
                        textField('unit', 'unit', '°C'),
                        numberField('decimals', 'decimals', 1, { min: 0, max: 4, step: 1 }),
                        textField('prefix', 'prefix', ''),
                        textField('suffix', 'suffix', ''),
                        checkboxField('showIcon', 'show_icon', true),
                        checkboxField('showStatus', 'show_status', true),
                        checkboxField('showUnit', 'show_unit', true),
                    ],
                },
                {
                    name: GROUP_BEHAVIOR,
                    fields: [checkboxField('animation', 'animation', true)],
                },
            ],
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return MyValueCard.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const { status, value } = this.readField<unknown>('oid');
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

        // Value Card accepts boolean/number/string states (spec item 25): numeric
        // values get full prefix/suffix/unit/decimals formatting, everything else
        // (e.g. a status text) is shown as-is instead of being hidden behind "–".
        const displayValue = isNumeric(value)
            ? formatNumber(value, {
                  decimals: rxData.decimals ?? 1,
                  prefix: rxData.prefix || '',
                  suffix: rxData.suffix || '',
                  unit: rxData.showUnit === false ? '' : rxData.unit || '',
              })
            : String(value ?? '–');

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-value-card" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {status !== 'ok' ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__header">
                                {rxData.showStatus !== false && <span className="mw-status-dot mw-status-dot--on" style={{ background: rxData.accentColor || undefined }} />}
                                <div className="mw-card__title-group">
                                    <span className="mw-card__title">{rxData.title}</span>
                                </div>
                                {rxData.showIcon !== false && (
                                    <Icon name={(rxData.icon as IconName) || 'thermometer'} className="mw-value-card__icon" style={rxData.accentColor ? { color: rxData.accentColor } : undefined} />
                                )}
                            </div>
                            <div className="mw-card__body">
                                <div className="mw-card__value" style={rxData.accentColor ? { color: rxData.accentColor } : undefined}>
                                    {displayValue}
                                </div>
                                {rxData.subtitle ? <div className="mw-card__subtitle">{rxData.subtitle}</div> : null}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

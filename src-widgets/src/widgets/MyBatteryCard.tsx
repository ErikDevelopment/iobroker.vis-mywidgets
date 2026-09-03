import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { formatSigned, formatNumber } from '../common/format';
import { toNumber } from '../common/stateValue';
import MiniChart, { LiveSampler } from '../common/MiniChart';
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
import './MyBatteryCard.css';

export interface MyBatteryCardRxData {
    oidPower: string;
    oidToday: string;
    oidSoc: string;
    title: string;
    icon: string;
    accentColor: string;
    background: string;
    radius: number;
    unit: string;
    decimals: number;
    showChart: boolean;
    animation: boolean;
}

export default class MyBatteryCard extends MyWidgetBase<MyBatteryCardRxData, VisRxWidgetState> {
    private sampler = new LiveSampler(90);

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyBatteryCard',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'widgets/mywidgets/img/mywidgets.svg',
            visName: 'Battery Card',
            visWidgetLabel: 'mywidgets_battery_card',
            visPrev: 'widgets/mywidgets/img/preview-battery-card.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        textField('title', 'title', 'Batterie'),
                        { name: 'oidPower', label: 'oid_power', type: 'id' },
                        { name: 'oidToday', label: 'oid_today', type: 'id' },
                        { name: 'oidSoc', label: 'oid_soc', type: 'id' },
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: designFields('battery'),
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [
                        textField('unit', 'unit', 'kWh'),
                        numberField('decimals', 'decimals', 2, { min: 0, max: 4, step: 1 }),
                        checkboxField('showChart', 'show_chart', true),
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
        return MyBatteryCard.getWidgetInfo();
    }

    componentDidMount(): void {
        super.componentDidMount();
        const power = this.readNumber('oidPower');
        if (power !== null) {
            this.sampler.push(power);
        }
    }

    onStateUpdated(id: string, state: ioBroker.State): void {
        super.onStateUpdated(id, state);
        if (id && id === this.oidOf('oidPower')) {
            this.sampler.push(this.readNumber('oidPower'));
            this.forceUpdate();
        }
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const radius = rxData.radius ?? 20;
        const power = this.readField<unknown>('oidPower');
        const today = this.readField<unknown>('oidToday');
        const soc = this.readField<unknown>('oidSoc');
        const hasAny = power.status === 'ok' || today.status === 'ok';

        if (!rxData.oidPower && !rxData.oidToday) {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const mainValue = today.status === 'ok' ? today.value : power.value;
        const num = toNumber(mainValue);
        const isDischarge = num !== null && num < 0;
        const autoColor = isDischarge ? 'var(--mw-t-blue)' : 'var(--mw-t-green)';
        const color = rxData.accentColor || autoColor;
        const points = this.sampler.get();

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-battery-card" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {!hasAny ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__header">
                                <span className="mw-status-dot mw-status-dot--on" style={{ background: color }} />
                                <span className="mw-card__title">{rxData.title}</span>
                                <Icon
                                    name={(rxData.icon as IconName) || (isDischarge ? 'battery' : 'battery-charging')}
                                    className="mw-battery-card__icon"
                                    style={{ color }}
                                />
                                {soc.status === 'ok' && (
                                    <span className="mw-battery-card__soc">{formatNumber(soc.value, { decimals: 0, unit: '%' })}</span>
                                )}
                            </div>
                            <div className="mw-card__body">
                                <div className="mw-card__value" style={{ color }}>
                                    {formatSigned(mainValue, { decimals: rxData.decimals ?? 2, unit: rxData.unit || 'kWh' })}
                                </div>
                                <div className="mw-card__subtitle">
                                    {today.status === 'ok' ? (isDischarge ? 'Netz entladen' : 'Netz geladen') : 'Aktuell'}
                                </div>
                            </div>
                            {rxData.showChart !== false && points.length > 1 && (
                                <div className="mw-battery-card__chart">
                                    <MiniChart points={points} color={color} fillArea height={40} />
                                    <div className="mw-battery-card__chart-axis">
                                        <span>{new Date(points[0].t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>{new Date(points[points.length - 1].t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
}

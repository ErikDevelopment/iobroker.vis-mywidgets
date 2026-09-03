import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { formatNumber } from '../common/format';
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
import './MyEnergyCard.css';

export interface MyEnergyCardRxData {
    oidPower: string;
    oidToday: string;
    oidWeek: string;
    oidMonth: string;
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

export default class MyEnergyCard extends MyWidgetBase<MyEnergyCardRxData, VisRxWidgetState> {
    private sampler = new LiveSampler(90);

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyEnergyCard',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Energy Card',
            visWidgetLabel: 'mywidgets_energy_card',
            visPrev: 'mywidgets/img/preview-energy-card.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        textField('title', 'title', 'Produktion'),
                        { name: 'oidPower', label: 'oid_power', type: 'id' },
                        { name: 'oidToday', label: 'oid_today', type: 'id' },
                        { name: 'oidWeek', label: 'oid_week', type: 'id' },
                        { name: 'oidMonth', label: 'oid_month', type: 'id' },
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: designFields('bolt'),
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
        return MyEnergyCard.getWidgetInfo();
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
        const today = this.readField<unknown>('oidToday');
        const power = this.readField<unknown>('oidPower');
        const hasAny = today.status === 'ok' || power.status === 'ok';

        if (!rxData.oidToday && !rxData.oidPower) {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const color = rxData.accentColor || undefined;
        const points = this.sampler.get();

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-energy-card" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {!hasAny ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__header">
                                <span className="mw-status-dot mw-status-dot--on" style={{ background: color }} />
                                <span className="mw-card__title">{rxData.title}</span>
                                <Icon name={(rxData.icon as IconName) || 'bolt'} className="mw-energy-card__icon" style={color ? { color } : undefined} />
                            </div>
                            <div className="mw-card__body">
                                <div className="mw-card__value mw-energy-card__value" style={color ? { color } : undefined}>
                                    {formatNumber(today.status === 'ok' ? today.value : power.value, { decimals: rxData.decimals ?? 2, unit: rxData.unit || 'kWh' })}
                                </div>
                                <div className="mw-card__subtitle">{today.status === 'ok' ? 'Heute' : 'Aktuell'}</div>
                            </div>
                            {rxData.showChart !== false && points.length > 1 && (
                                <div className="mw-energy-card__chart">
                                    <MiniChart points={points} color={color || 'var(--mw-t-green)'} fillArea height={40} yMin={0} />
                                    <div className="mw-energy-card__chart-axis">
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

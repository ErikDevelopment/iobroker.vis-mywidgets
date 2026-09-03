import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { formatNumber, clamp } from '../common/format';
import { toNumber } from '../common/stateValue';
import { designFields, checkboxField, numberField, textField, GROUP_DATA, GROUP_DESIGN, GROUP_DISPLAY, GROUP_BEHAVIOR } from '../common/attrFields';
import './MyWallboxCard.css';

export interface MyWallboxCardRxData {
    title: string;
    oidPower: string;
    oidSoc: string;
    oidEnergy: string;
    oidStatusText: string;
    icon: string;
    accentColor: string;
    background: string;
    radius: number;
    unit: string;
    decimals: number;
    animation: boolean;
}

export default class MyWallboxCard extends MyWidgetBase<MyWallboxCardRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyWallboxCard',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Wallbox Card',
            visWidgetLabel: 'mywidgets_wallbox_card',
            visPrev: 'mywidgets/img/preview-wallbox.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        textField('title', 'title', 'Wallbox'),
                        { name: 'oidPower', label: 'oid_power', type: 'id' },
                        { name: 'oidSoc', label: 'oid_soc', type: 'id' },
                        { name: 'oidEnergy', label: 'oid_energy', type: 'id' },
                        { name: 'oidStatusText', label: 'oid_status_text', type: 'id' },
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: designFields('plug'),
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [textField('unit', 'unit', 'kW'), numberField('decimals', 'decimals', 1, { min: 0, max: 3, step: 1 })],
                },
                {
                    name: GROUP_BEHAVIOR,
                    fields: [checkboxField('animation', 'animation', true)],
                },
            ],
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return MyWallboxCard.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const radius = rxData.radius ?? 20;
        const power = this.readField<unknown>('oidPower');
        const soc = this.readField<unknown>('oidSoc');
        const energy = this.readField<unknown>('oidEnergy');
        const statusText = this.readField<unknown>('oidStatusText');

        if (!rxData.oidPower && !rxData.oidSoc) {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const color = rxData.accentColor || 'var(--mw-t-green)';
        const powerNum = toNumber(power.value);
        const isCharging = powerNum !== null && powerNum > 0.05;
        const derivedStatus = statusText.status === 'ok' ? String(statusText.value) : isCharging ? 'Laden' : 'Bereit';
        const socPercent = clamp(toNumber(soc.value) ?? 0, 0, 100);

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-wallbox-card" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {power.status !== 'ok' && soc.status !== 'ok' ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__header">
                                <span className={`mw-status-dot ${isCharging ? 'mw-status-dot--on' : ''}`} style={isCharging ? { background: color } : undefined} />
                                <span className="mw-card__title">{rxData.title}</span>
                                <Icon name={(rxData.icon as IconName) || 'plug'} active={isCharging} className="mw-wallbox-card__icon" style={isCharging ? { color } : undefined} />
                            </div>
                            <div className="mw-card__body">
                                <div className="mw-card__value" style={isCharging ? { color } : undefined}>
                                    {power.status === 'ok' ? formatNumber(power.value, { decimals: rxData.decimals ?? 1, unit: rxData.unit || 'kW' }) : '–'}
                                </div>
                                <div className="mw-card__subtitle">{derivedStatus}</div>
                            </div>
                            {soc.status === 'ok' && (
                                <div className="mw-wallbox-card__progress">
                                    <div className="mw-wallbox-card__progress-track">
                                        <div className="mw-wallbox-card__progress-fill" style={{ width: `${socPercent}%`, background: color }} />
                                    </div>
                                    <span className="mw-wallbox-card__progress-label">{formatNumber(socPercent, { decimals: 0, unit: '%' })}</span>
                                </div>
                            )}
                            {energy.status === 'ok' && (
                                <div className="mw-card__footer">
                                    <span>{formatNumber(energy.value, { decimals: 2, unit: 'kWh' })}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
}

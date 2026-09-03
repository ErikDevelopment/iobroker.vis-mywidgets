import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import Unavailable from '../common/Unavailable';
import { formatNumber } from '../common/format';
import { checkboxField, colorField, numberField, textField, GROUP_DATA, GROUP_DESIGN, GROUP_DISPLAY, GROUP_BEHAVIOR } from '../common/attrFields';
import './MyWeatherCard.css';

export interface MyWeatherCardRxData {
    location: string;
    oidTemp: string;
    oidCondition: string;
    oidFeelsLike: string;
    oidHumidity: string;
    oidWind: string;
    oidWindDir: string;
    oidPressure: string;
    oidUv: string;
    icon: string;
    accentColor: string;
    background: string;
    radius: number;
    decimals: number;
    animation: boolean;
}

/** Maps a free-text weather condition (as delivered by typical weather adapters) to one of our icons. */
function conditionToIcon(condition: unknown): IconName {
    const text = String(condition ?? '').toLowerCase();
    if (!text) return 'sun';
    if (/(schnee|snow|sleet)/.test(text)) return 'snowflake';
    if (/(gewitter|thunder|storm)/.test(text)) return 'cloud-rain';
    if (/(regen|rain|shower|drizzle)/.test(text)) return 'cloud-rain';
    if (/(nebel|fog|mist|haze)/.test(text)) return 'cloud';
    if (/(wind|böig|breez)/.test(text)) return 'wind';
    if (/(wolk|cloud|bedeckt|overcast)/.test(text)) return 'cloud';
    if (/(nacht|night|clear.?night)/.test(text)) return 'moon';
    if (/(sonne|sonnig|clear|sun)/.test(text)) return 'sun';
    return 'sun';
}

export default class MyWeatherCard extends MyWidgetBase<MyWeatherCardRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyWeatherCard',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Weather Card',
            visWidgetLabel: 'mywidgets_weather_card',
            visPrev: 'mywidgets/img/preview-weather-card.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [
                        textField('location', 'location', 'Frankfurt'),
                        { name: 'oidTemp', label: 'oid_temp', type: 'id' },
                        { name: 'oidCondition', label: 'oid_condition', type: 'id' },
                        { name: 'oidFeelsLike', label: 'oid_feels_like', type: 'id' },
                        { name: 'oidHumidity', label: 'oid_humidity', type: 'id' },
                        { name: 'oidWind', label: 'oid_wind', type: 'id' },
                        { name: 'oidWindDir', label: 'oid_wind_dir', type: 'id' },
                        { name: 'oidPressure', label: 'oid_pressure', type: 'id' },
                        { name: 'oidUv', label: 'oid_uv', type: 'id' },
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: [
                        textField('icon', 'icon', ''),
                        colorField('accentColor', 'accent_color', ''),
                        colorField('background', 'background', ''),
                        numberField('radius', 'radius', 20, { min: 0, max: 40, step: 1 }),
                    ],
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [numberField('decimals', 'decimals', 0, { min: 0, max: 2, step: 1 })],
                },
                {
                    name: GROUP_BEHAVIOR,
                    fields: [checkboxField('animation', 'animation', true)],
                },
            ],
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return MyWeatherCard.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const radius = rxData.radius ?? 20;
        const temp = this.readField<unknown>('oidTemp');
        const condition = this.readField<unknown>('oidCondition');
        const humidity = this.readField<unknown>('oidHumidity');
        const wind = this.readField<unknown>('oidWind');
        const feelsLike = this.readField<unknown>('oidFeelsLike');
        const pressure = this.readField<unknown>('oidPressure');
        const uv = this.readField<unknown>('oidUv');

        if (!rxData.oidTemp) {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const color = rxData.accentColor || undefined;
        const iconName = (rxData.icon as IconName) || conditionToIcon(condition.value);

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-weather-card" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {temp.status !== 'ok' ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__header">
                                <Icon name={iconName} active className="mw-weather-card__icon" style={color ? { color } : undefined} />
                                <span className="mw-card__title">Wetter</span>
                            </div>
                            <div className="mw-card__body">
                                <div className="mw-card__value" style={color ? { color } : undefined}>
                                    {formatNumber(temp.value, { decimals: rxData.decimals ?? 0, unit: '°C' })}
                                </div>
                                <div className="mw-card__subtitle">
                                    {rxData.location}
                                    {feelsLike.status === 'ok' ? ` · gefühlt ${formatNumber(feelsLike.value, { decimals: 0, unit: '°C' })}` : ''}
                                </div>
                            </div>
                            <div className="mw-weather-card__footer">
                                {humidity.status === 'ok' && (
                                    <span className="mw-weather-card__stat">
                                        <Icon name="droplet" />
                                        {formatNumber(humidity.value, { decimals: 0, unit: '%' })}
                                    </span>
                                )}
                                {wind.status === 'ok' && (
                                    <span className="mw-weather-card__stat">
                                        <Icon name="wind" />
                                        {formatNumber(wind.value, { decimals: 0, unit: 'km/h' })}
                                    </span>
                                )}
                                {pressure.status === 'ok' && (
                                    <span className="mw-weather-card__stat">
                                        <Icon name="gauge" />
                                        {formatNumber(pressure.value, { decimals: 0, unit: 'hPa' })}
                                    </span>
                                )}
                                {uv.status === 'ok' && (
                                    <span className="mw-weather-card__stat">
                                        <Icon name="sun" />
                                        UV {formatNumber(uv.value, { decimals: 0 })}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState, VisRxWidgetProps } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Unavailable from '../common/Unavailable';
import { formatNumber, clamp } from '../common/format';
import { toNumber } from '../common/stateValue';
import { checkboxField, colorField, numberField, textField, GROUP_DATA, GROUP_DESIGN, GROUP_DISPLAY, GROUP_BEHAVIOR } from '../common/attrFields';
import './MySlider.css';

export interface MySliderRxData {
    oid: string;
    title: string;
    accentColor: string;
    background: string;
    radius: number;
    unit: string;
    min: number;
    max: number;
    step: number;
    decimals: number;
    animation: boolean;
}

interface MySliderState extends VisRxWidgetState {
    dragValue: number | null;
}

const WRITE_THROTTLE_MS = 120;

export default class MySlider extends MyWidgetBase<MySliderRxData, MySliderState> {
    private trackRef = React.createRef<HTMLDivElement>();

    private lastWrite = 0;

    private pendingWrite: number | null = null;

    private throttleTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = { ...this.state, dragValue: null };
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMySlider',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Slider',
            visWidgetLabel: 'mywidgets_slider',
            visPrev: 'mywidgets/img/preview-slider.png',
            visAttrs: [
                {
                    name: GROUP_DATA,
                    fields: [{ name: 'oid', label: 'object_id', type: 'id' }, textField('title', 'title', 'Helligkeit')],
                },
                {
                    name: GROUP_DESIGN,
                    fields: [colorField('accentColor', 'accent_color', ''), colorField('background', 'background', ''), numberField('radius', 'radius', 20, { min: 0, max: 40, step: 1 })],
                },
                {
                    name: GROUP_DISPLAY,
                    fields: [
                        textField('unit', 'unit', '%'),
                        numberField('min', 'min', 0),
                        numberField('max', 'max', 100),
                        numberField('step', 'step', 1, { min: 0.01 }),
                        numberField('decimals', 'decimals', 0, { min: 0, max: 4, step: 1 }),
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
        return MySlider.getWidgetInfo();
    }

    componentWillUnmount(): void {
        if (this.throttleTimer) {
            clearTimeout(this.throttleTimer);
        }
        super.componentWillUnmount();
    }

    private valueFromClientX(clientX: number): number {
        const { rxData } = this.state;
        const min = rxData.min ?? 0;
        const max = rxData.max ?? 100;
        const step = rxData.step || 1;
        const el = this.trackRef.current;
        if (!el) {
            return min;
        }
        const rect = el.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        return clamp(Number(stepped.toFixed(6)), min, max);
    }

    private writeThrottled(value: number): void {
        this.pendingWrite = value;
        const now = Date.now();
        if (now - this.lastWrite >= WRITE_THROTTLE_MS) {
            this.flushWrite();
        } else if (!this.throttleTimer) {
            this.throttleTimer = setTimeout(() => this.flushWrite(), WRITE_THROTTLE_MS);
        }
    }

    private flushWrite(): void {
        if (this.throttleTimer) {
            clearTimeout(this.throttleTimer);
            this.throttleTimer = null;
        }
        if (this.pendingWrite !== null) {
            this.writeField('oid', this.pendingWrite);
            this.lastWrite = Date.now();
            this.pendingWrite = null;
        }
    }

    private handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
        if (!this.state.rxData.oid) {
            return;
        }
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        const value = this.valueFromClientX(e.clientX);
        this.setState({ dragValue: value });
        this.writeThrottled(value);
    };

    private handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
        if (this.state.dragValue === null) {
            return;
        }
        const value = this.valueFromClientX(e.clientX);
        this.setState({ dragValue: value });
        this.writeThrottled(value);
    };

    private handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
        if (this.state.dragValue === null) {
            return;
        }
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        const value = this.state.dragValue;
        this.setState({ dragValue: null });
        this.pendingWrite = value;
        this.flushWrite();
    };

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const radius = rxData.radius ?? 20;
        const { status, value } = this.readField<unknown>('oid');

        if (status === 'no-oid') {
            return (
                <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                    <div className="mw-card" style={{ borderRadius: radius }}>
                        <Unavailable noOid />
                    </div>
                </div>
            );
        }

        const min = rxData.min ?? 0;
        const max = rxData.max ?? 100;
        const currentValue = this.state.dragValue !== null ? this.state.dragValue : toNumber(value) ?? min;
        const percent = clamp(((currentValue - min) / (max - min || 1)) * 100, 0, 100);
        const color = rxData.accentColor || 'var(--mw-t-green)';

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div className="mw-card mw-slider" style={{ borderRadius: radius, background: rxData.background || undefined }}>
                    {status !== 'ok' ? (
                        <Unavailable />
                    ) : (
                        <>
                            <div className="mw-card__title">{rxData.title}</div>
                            <div
                                className="mw-slider__track"
                                ref={this.trackRef}
                                onPointerDown={this.handlePointerDown}
                                onPointerMove={this.handlePointerMove}
                                onPointerUp={this.handlePointerUp}
                                onPointerCancel={this.handlePointerUp}
                                role="slider"
                                aria-valuemin={min}
                                aria-valuemax={max}
                                aria-valuenow={currentValue}
                                tabIndex={0}
                            >
                                <div className="mw-slider__fill" style={{ width: `${percent}%`, background: color }} />
                                <div className="mw-slider__thumb" style={{ left: `${percent}%`, background: color }} />
                            </div>
                            <div className="mw-slider__value">{formatNumber(currentValue, { decimals: rxData.decimals ?? 0, unit: rxData.unit || '' })}</div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

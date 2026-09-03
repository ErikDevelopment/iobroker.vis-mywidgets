import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import MyWidgetBase from '../common/BaseWidget';
import Icon, { type IconName } from '../common/Icon';
import { checkboxField, colorField, numberField, selectField, textField, GROUP_DESIGN, GROUP_BEHAVIOR } from '../common/attrFields';
import './MyNavigationButton.css';

export type NavTargetType = 'view' | 'url';

export interface MyNavigationButtonRxData {
    label: string;
    icon: string;
    targetType: NavTargetType;
    targetView: string;
    targetUrl: string;
    openInNewTab: boolean;
    accentColor: string;
    radius: number;
    animation: boolean;
}

export default class MyNavigationButton extends MyWidgetBase<MyNavigationButtonRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplMyNavigationButton',
            visSet: 'mywidgets',
            visSetLabel: 'mywidgets_set_label',
            visSetColor: '#50d890',
            visSetIcon: 'mywidgets/img/mywidgets.svg',
            visName: 'Navigation Button',
            visWidgetLabel: 'mywidgets_navigation_button',
            visPrev: 'mywidgets/img/preview-navigation.png',
            visAttrs: [
                {
                    name: 'data',
                    fields: [
                        textField('label', 'title', 'Startseite'),
                        selectField('targetType', 'target_type', ['view', 'url'], 'view'),
                        { name: 'targetView', label: 'target_view', type: 'select-views' },
                        { name: 'targetUrl', label: 'target_url', type: 'url', default: '' },
                        checkboxField('openInNewTab', 'open_in_new_tab', false),
                    ],
                },
                {
                    name: GROUP_DESIGN,
                    fields: [
                        textField('icon', 'icon', 'home'),
                        colorField('accentColor', 'accent_color', ''),
                        numberField('radius', 'radius', 14, { min: 0, max: 40, step: 1 }),
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
        return MyNavigationButton.getWidgetInfo();
    }

    private handleClick = (): void => {
        const { rxData } = this.state;
        try {
            if (rxData.targetType === 'url' && rxData.targetUrl) {
                window.open(rxData.targetUrl, rxData.openInNewTab ? '_blank' : '_self');
            } else if (rxData.targetView) {
                this.props.context.changeView(rxData.targetView);
            }
        } catch {
            // navigation must never crash the dashboard - silently ignore
        }
    };

    private isActive(): boolean {
        const { rxData } = this.state;
        if (rxData.targetType !== 'view' || !rxData.targetView) {
            return false;
        }
        return this.props.context.activeView === rxData.targetView;
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const { rxData } = this.state;
        const active = this.isActive();
        const color = active ? rxData.accentColor || 'var(--mw-t-green)' : undefined;

        return (
            <div className="mw-root" style={{ width: '100%', height: '100%' }}>
                <div
                    className={`mw-nav-btn ${active ? 'mw-nav-btn--active' : ''}`}
                    style={{ borderRadius: rxData.radius ?? 14 }}
                    onClick={this.handleClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') this.handleClick();
                    }}
                >
                    <Icon name={(rxData.icon as IconName) || 'home'} active={active} style={color ? { color } : undefined} />
                    <span className="mw-nav-btn__label" style={color ? { color } : undefined}>
                        {rxData.label}
                    </span>
                </div>
            </div>
        );
    }
}

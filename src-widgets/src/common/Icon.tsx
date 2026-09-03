import React from 'react';

/**
 * Small, self-contained, monochrome stroke-icon set.
 *
 * Every icon is an original, simple geometric pictogram (no external icon
 * font / icon library dependency), drawn on a 24x24 grid with
 * stroke="currentColor" so it inherits color + the active/glow treatment
 * from `.mw-icon` / `.mw-icon--active` (see theme.css). This keeps the
 * bundle tiny and avoids pulling in a whole icon-font just to show a
 * light bulb.
 *
 * Add new icons by extending ICONS - nothing else needs to change.
 */
export type IconName =
    | 'lightbulb'
    | 'power'
    | 'home'
    | 'bolt'
    | 'battery'
    | 'battery-charging'
    | 'sun'
    | 'cloud'
    | 'cloud-rain'
    | 'wind'
    | 'droplet'
    | 'gauge'
    | 'chevron-up'
    | 'chevron-down'
    | 'chevron-left'
    | 'chevron-right'
    | 'minus'
    | 'plus'
    | 'thermometer'
    | 'shutter'
    | 'plug'
    | 'settings'
    | 'chart'
    | 'grid'
    | 'navigation'
    | 'alert'
    | 'snowflake'
    | 'fan'
    | 'moon';

const ICONS: Record<IconName, React.ReactNode> = {
    lightbulb: (
        <>
            <path d="M9 18h6M10 21h4" strokeLinecap="round" />
            <path
                d="M12 3a6 6 0 0 0-3.6 10.8c.6.45 1 1.15 1 1.9V16h5.2v-.3c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    power: (
        <>
            <path d="M12 3v8" strokeLinecap="round" />
            <path d="M7 6.5a7 7 0 1 0 10 0" strokeLinecap="round" />
        </>
    ),
    home: (
        <path
            d="M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    bolt: <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z" strokeLinecap="round" strokeLinejoin="round" />,
    battery: (
        <>
            <rect x="3" y="8" width="15" height="8" rx="2" />
            <path d="M20 10.5v3" strokeLinecap="round" />
        </>
    ),
    'battery-charging': (
        <>
            <rect x="3" y="8" width="15" height="8" rx="2" />
            <path d="M20 10.5v3" strokeLinecap="round" />
            <path d="M12 9.5 9.5 12.7h2.2L10.4 15.5 14 12H11.8Z" strokeLinejoin="round" />
        </>
    ),
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path
                d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                strokeLinecap="round"
            />
        </>
    ),
    cloud: <path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.2 8.1 4 4 0 0 1 16.5 18H7Z" strokeLinejoin="round" />,
    'cloud-rain': (
        <>
            <path d="M7 15.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.2 5.6 4 4 0 0 1 16.5 15.5H7Z" strokeLinejoin="round" />
            <path d="M9 18.5 8 21M13 18.5l-1 2.5M17 18.5l-1 2.5" strokeLinecap="round" />
        </>
    ),
    wind: (
        <path
            d="M3 8h11.5a2.5 2.5 0 1 0-2.4-3.2M3 12h14a2.7 2.7 0 1 1-2.6 3.4M3 16h9a2.2 2.2 0 1 1-2.1 2.8"
            strokeLinecap="round"
        />
    ),
    droplet: <path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z" strokeLinejoin="round" />,
    gauge: (
        <>
            <path d="M4 16a8 8 0 1 1 16 0" strokeLinecap="round" />
            <path d="M12 16 15.5 10" strokeLinecap="round" />
        </>
    ),
    'chevron-up': <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
    'chevron-down': <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
    'chevron-left': <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
    'chevron-right': <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
    minus: <path d="M5 12h14" strokeLinecap="round" />,
    plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
    thermometer: (
        <>
            <path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z" strokeLinejoin="round" />
            <circle cx="10" cy="17" r="1.2" fill="currentColor" stroke="none" />
        </>
    ),
    shutter: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M4 9h16M4 13h16M4 17h16" strokeLinecap="round" />
        </>
    ),
    plug: (
        <>
            <path d="M9 3v4M15 3v4" strokeLinecap="round" />
            <path d="M6.5 7h11v4a5.5 5.5 0 0 1-11 0V7Z" strokeLinejoin="round" />
            <path d="M12 15.5V21" strokeLinecap="round" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path
                d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"
                strokeLinecap="round"
            />
        </>
    ),
    chart: <path d="M4 19V9M10 19V5M16 19v-7M4 19h16" strokeLinecap="round" strokeLinejoin="round" />,
    grid: (
        <>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </>
    ),
    navigation: <path d="M12 2 5 21l7-4 7 4-7-19Z" strokeLinejoin="round" />,
    alert: (
        <>
            <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
            <path d="M12 10v4" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
        </>
    ),
    snowflake: (
        <path
            d="M12 2v20M4 7l16 10M20 7 4 17M8 4l4 3 4-3M8 20l4-3 4 3M2 12h4M18 12h4"
            strokeLinecap="round"
        />
    ),
    fan: (
        <>
            <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            <path
                d="M12 12c0-3.5 2-6 4.5-6s2.5 2.8.5 4.3S12 12 12 12Zm0 0c-3.5 0-6 2-6 4.5s2.8 2.5 4.3.5S12 12 12 12Zm0 0c0 3.5-2 6-4.5 6S5 15.7 7 14.2s5-2.2 5-2.2Zm0 0c3.5 0 6-2 6-4.5S15.2 5 12.7 7 12 12 12 12Z"
                strokeLinejoin="round"
            />
        </>
    ),
    moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" strokeLinejoin="round" />,
};

export interface IconProps {
    name: IconName;
    className?: string;
    active?: boolean;
    style?: React.CSSProperties;
}

export default function Icon({ name, className, active, style }: IconProps): React.JSX.Element {
    const cls = ['mw-icon', active ? 'mw-icon--active' : '', className || ''].filter(Boolean).join(' ');
    return (
        <span className={cls} style={style}>
            <svg viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true" focusable="false">
                {ICONS[name] || null}
            </svg>
        </span>
    );
}

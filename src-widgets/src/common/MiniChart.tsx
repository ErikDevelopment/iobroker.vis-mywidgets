import React from 'react';

export interface ChartPoint {
    t: number;
    v: number;
}

export interface MiniChartProps {
    points: ChartPoint[];
    color: string;
    fillArea?: boolean;
    height?: number;
    /** fixes the y-axis range instead of auto-scaling to the data (e.g. 0-100 for a SoC chart) */
    yMin?: number;
    yMax?: number;
}

/**
 * Extremely minimal line chart: no axes, no gridlines, no ticks - just a
 * smooth, dezent line (+ optional area fill) as required by spec item 9/10
 * ("keine großen Achsen", "keine sichtbaren Rahmen"). Renders nothing (not
 * even an empty frame) when there is not enough data yet, so a freshly
 * added widget never shows a broken chart.
 */
export default function MiniChart({ points, color, fillArea, height = 40, yMin, yMax }: MiniChartProps): React.JSX.Element | null {
    if (!points || points.length < 2) {
        return null;
    }

    const width = 100; // viewBox units, scales via CSS width: 100%
    const values = points.map((p) => p.v);
    const min = yMin ?? Math.min(...values);
    const max = yMax ?? Math.max(...values);
    const range = max - min || 1;
    const tStart = points[0].t;
    const tEnd = points[points.length - 1].t || tStart + 1;
    const tRange = tEnd - tStart || 1;

    const coords = points.map((p) => {
        const x = ((p.t - tStart) / tRange) * width;
        const y = height - ((p.v - min) / range) * height;
        return [x, y] as const;
    });

    const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return (
        <svg
            className="mw-mini-chart"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            width="100%"
            height={height}
        >
            {fillArea && <path d={areaPath} fill={color} opacity={0.14} stroke="none" />}
            <path d={linePath} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * Small fixed-size ring buffer that samples a live value over time so every
 * card widget can show a "Mini-Chart" / trend out of the box, with zero
 * ioBroker history-adapter dependency. Widgets that want a true historical
 * (e.g. full 00:00-24:00) chart can swap the data source for
 * `context.socket.getHistory(...)` (available whenever a History/SQL/
 * InfluxDB instance is installed) without changing the rendering side -
 * see README "Charts & Historie" for the extension point.
 */
export class LiveSampler {
    private points: ChartPoint[] = [];

    constructor(private readonly maxPoints = 60) {}

    push(value: number | null | undefined): void {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return;
        }
        const now = Date.now();
        const last = this.points[this.points.length - 1];
        if (last && now - last.t < 1000) {
            // avoid flooding the buffer on rapid successive state updates
            last.v = value;
            return;
        }
        this.points.push({ t: now, v: value });
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }
    }

    get(): ChartPoint[] {
        return this.points;
    }
}

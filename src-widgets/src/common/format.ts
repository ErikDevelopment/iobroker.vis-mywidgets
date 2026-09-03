/**
 * Number/value formatting helpers shared by all MyWidgets widgets.
 *
 * Defaults follow a German locale (comma decimal separator, dot thousands
 * separator) as requested, but every aspect is configurable per widget:
 * decimals, separators, prefix/suffix and unit.
 */

export interface NumberFormatOptions {
    /** number of digits after the decimal separator (default: 1) */
    decimals?: number;
    /** character between integer and fractional part (default: ",") */
    decimalSeparator?: string;
    /** character grouping thousands, "" disables grouping (default: ".") */
    thousandsSeparator?: string;
    /** text prepended before the number, e.g. "+" (default: "") */
    prefix?: string;
    /** text appended directly after the number, before the unit (default: "") */
    suffix?: string;
    /** unit appended after a space, e.g. "kWh" (default: "") */
    unit?: string;
}

const DEFAULT_FORMAT: Required<NumberFormatOptions> = {
    decimals: 1,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    prefix: '',
    suffix: '',
    unit: '',
};

/** Returns true if a value can meaningfully be treated as a finite number. */
export function isNumeric(value: unknown): value is number | string {
    if (value === null || value === undefined || value === '') {
        return false;
    }
    return Number.isFinite(typeof value === 'string' ? Number(value) : value);
}

/**
 * Formats a numeric value for display, e.g. formatNumber(14.109, { decimals: 2, unit: 'kWh' })
 * -> "14,11 kWh". Returns a localized "no value" placeholder for anything not numeric.
 */
export function formatNumber(value: unknown, options: NumberFormatOptions = {}): string {
    const opts = { ...DEFAULT_FORMAT, ...options };

    if (!isNumeric(value)) {
        return '–';
    }

    const num = typeof value === 'string' ? Number(value) : (value as number);
    const decimals = Math.max(0, Math.min(6, opts.decimals));
    const fixed = Math.abs(num).toFixed(decimals);
    const [intPartRaw, fracPart] = fixed.split('.');

    let intPart = intPartRaw;
    if (opts.thousandsSeparator) {
        intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandsSeparator);
    }

    const sign = num < 0 ? '-' : '';
    const numberStr = fracPart !== undefined && decimals > 0 ? `${intPart}${opts.decimalSeparator}${fracPart}` : intPart;
    const unitPart = opts.unit ? ` ${opts.unit}` : '';

    return `${sign}${opts.prefix}${numberStr}${opts.suffix}${unitPart}`;
}

/** Formats a signed power/energy value with an explicit "+" for positive numbers. */
export function formatSigned(value: unknown, options: NumberFormatOptions = {}): string {
    if (!isNumeric(value)) {
        return '–';
    }
    const num = typeof value === 'string' ? Number(value) : (value as number);
    const formatted = formatNumber(Math.abs(num), options);
    return num < 0 ? `-${formatted}` : `+${formatted}`;
}

/** Clamps a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
    if (Number.isNaN(value)) {
        return min;
    }
    return Math.min(max, Math.max(min, value));
}

/** Formats a timestamp (ms) as a localized short time string, e.g. "14:32". */
export function formatTime(ts: number | undefined | null): string {
    if (!ts) {
        return '--:--';
    }
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) {
        return '--:--';
    }
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

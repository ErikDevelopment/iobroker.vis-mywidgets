/**
 * Small helpers around the `values` map that vis-2's RxWidget base class
 * maintains automatically for every `id`-typed rxData field
 * (`this.state.values['<oid>.val']`, `.ts`, `.lc`, `.from`, see
 * VisRxWidgetStateValues in @iobroker/types-vis-2).
 *
 * Widgets must never assume an oid is configured or that the state
 * currently holds a value of the expected type - these helpers make that
 * explicit instead of every widget re-implementing the same null checks.
 */

export type OidStatus = 'ok' | 'no-oid' | 'unavailable';

export interface OidRead<T = unknown> {
    status: OidStatus;
    value: T | null;
}

export type ValuesMap = Record<string, unknown>;

/** Reads the current `.val` of an oid out of the RxWidget values map. */
export function readOid<T = unknown>(values: ValuesMap | undefined, oid: string | undefined | null): OidRead<T> {
    if (!oid) {
        return { status: 'no-oid', value: null };
    }
    if (!values) {
        return { status: 'unavailable', value: null };
    }
    const raw = values[`${oid}.val`];
    if (raw === undefined || raw === null) {
        return { status: 'unavailable', value: null };
    }
    return { status: 'ok', value: raw as T };
}

/** Coerces a raw ioBroker state value to boolean, tolerant of "true"/"false"/0/1. */
export function toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    if (typeof value === 'string') {
        return value === 'true' || value === '1';
    }
    return Boolean(value);
}

/** Coerces a raw ioBroker state value to a finite number, or null if not possible. */
export function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
        return Number(value);
    }
    return null;
}

/** Reads `.ts` (timestamp of last update) for an oid, if any. */
export function readOidTimestamp(values: ValuesMap | undefined, oid: string | undefined | null): number | null {
    if (!oid || !values) {
        return null;
    }
    const ts = values[`${oid}.ts`];
    return typeof ts === 'number' ? ts : null;
}
